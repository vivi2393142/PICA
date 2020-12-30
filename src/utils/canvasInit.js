import * as utils from './globalUtils';
import * as config from './globalConfig';
import initAligningGuidelines from './alignGuidelines';
import { saveCanvasData } from './firebase';
// preset canvas basic setting
const customControlSetting = { color: 'rgba(0,0,0,0.03)', borderColor: 'rgba(0,0,0,0.25)', lineWidth: 1 };
export const presetFabricStyles = (canvas) => {
    initAligningGuidelines(canvas);
    canvas.selectionColor = customControlSetting.color;
    canvas.selectionBorderColor = customControlSetting.borderColor;
    canvas.selectionLineWidth = customControlSetting.lineWidth;
    canvas.preserveObjectStacking = true;
};
const customBorder = {
    borderColor: 'rgba(0,0,0,0.25)',
    cornerColor: 'rgba(0,0,0,0.25)',
    cornerStrokeColor: 'rgba(0,0,0,0.25)',
    cornerSize: 10,
    cornerStyle: 'circle',
    cornerColor: 'white',
};
export const presetCustomBorder = () => {
    fabric.Object.prototype.set(customBorder);
};
export const preloadFontFace = () => {
    const FontFaceObserver = require('fontfaceobserver');
    const fontsArray = ['JetBrains Mono', 'Raleway', 'Montserrat Alternates'];
    Promise.all(fontsArray.map((font) => new FontFaceObserver(font).load())).then(() => {});
};
// preset objects style
const presetImageElements = (canvas) => {
    const imgObjects = canvas.getObjects('image');
    imgObjects.forEach((object) => {
        object.setControlsVisibility({
            mb: false,
            mt: false,
            ml: false,
            mr: false,
        });
    });
};
const presetTextElements = (canvas) => {
    const texObjects = canvas.getObjects('i-text');
    texObjects.forEach((object) => {
        object.setControlsVisibility({
            mb: false,
            mt: false,
            ml: false,
            mr: false,
        });
    });
};
const presetStickerElements = (canvas) => {
    const stickerObjects = canvas.getObjects('image').filter((x) => x.specialType === 'sticker');
    if (stickerObjects.length) {
        stickerObjects.forEach((sticker) => {
            canvas.remove(sticker);
            sticker.toObject = (function (toObject) {
                return function (propertiesToInclude) {
                    return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
                        specialType: 'sticker',
                    });
                };
            })(sticker.toObject);
            canvas.add(sticker);
            sticker.setControlsVisibility({
                mb: false,
                mt: false,
                ml: false,
                mr: false,
            });
        });
    }
};
export const presetSpecialElements = (canvas, canvasSetting) => {
    presetImageElements(canvas);
    presetTextElements(canvas);
    presetStickerElements(canvas);
    utils.presetBackgroundElements(canvas, canvasSetting);
};
// preset track modified to trigger auto save
export const autoSaveInit = (canvas, canvasSetting, fileId) => {
    const saveHandler = (e) => {
        if (e.target) {
            if (e.target.specialType === 'cropBackground' || e.target.specialType === 'cropbox') {
                return;
            }
        }
        saveCanvasData(canvas, canvasSetting, fileId);
    };
    canvas.on('object:modified', saveHandler);
    canvas.on('object:added', saveHandler);
    canvas.on('object:removed', saveHandler);
};
export const initActiveObjectTracking = (canvas, setActiveObj) => {
    canvas.on('selection:created', (e) => {
        setActiveObj(e.target);
    });
    canvas.on('selection:updated', (e) => {
        setActiveObj(e.target);
    });
    canvas.on('selection:cleared', (e) => {
        setActiveObj({});
    });
};
// preset dnd
export const setMovingItemType = (movingItem) => {
    const sidebarNode = movingItem.parentNode;
    const sidebarNodeForImg = sidebarNode.parentNode.parentNode;
    const movingItemType =
        sidebarNodeForImg.classList.contains('sidebarUnfoldImg') ||
        sidebarNode.classList.contains('unfoldItemImgWrapper')
            ? 'img'
            : sidebarNode.classList.contains('sidebarUnfoldText')
            ? 'text'
            : sidebarNode.classList.contains('sidebarUnfoldShape')
            ? 'shape'
            : sidebarNode.classList.contains('sidebarUnfoldLine')
            ? 'line'
            : sidebarNodeForImg.classList.contains('sidebarUnfoldSticker')
            ? 'sticker'
            : '';
    const shapeItemType = movingItem.classList.contains('rectShape')
        ? 'rect'
        : movingItem.classList.contains('radiusRectShape')
        ? 'radiusRect'
        : movingItem.classList.contains('circleShape')
        ? 'circle'
        : movingItem.classList.contains('triangleShape')
        ? 'triangle'
        : '';
    return { movingItemType, shapeItemType };
};
export const dropPosition = (movingItem, canvasSetting, dragEventObject, itemDragOffset) => {
    const viewWidth = parseInt(document.querySelector('.canvas-container').style.width);
    const settingWidth = canvasSetting.width;
    const currentSizeRatio = viewWidth / settingWidth;
    const targetOriginWidth = parseInt(movingItem.parentNode.style.width);
    const layoutZoomRatio = targetOriginWidth ? targetOriginWidth / 100 : 1;
    const position = {
        top: (dragEventObject.offsetY - itemDragOffset.offsetY * layoutZoomRatio) / currentSizeRatio,
        left: (dragEventObject.offsetX - itemDragOffset.offsetX * layoutZoomRatio) / currentSizeRatio,
    };
    return position;
};
export const dropItemHandler = (e, movingItem, canvas, canvasSetting, itemDragOffset, successCallback) => {
    if (Object.keys(movingItem).length) {
        const dragEventObject = e.e;
        const position = dropPosition(movingItem, canvasSetting, dragEventObject, itemDragOffset);
        const { movingItemType, shapeItemType } = setMovingItemType(movingItem);
        switch (movingItemType) {
            case 'img':
                utils.addImage(movingItem, position, canvas, canvasSetting);
                break;
            case 'text':
                const chosenIndex = config.textSetting.findIndex(
                    (item) => item.content === movingItem.textContent
                );
                utils.addIText(position, canvas, canvasSetting, chosenIndex);
                break;
            case 'shape':
                shapeItemType === 'rect'
                    ? utils.addRect(position, canvas, canvasSetting)
                    : shapeItemType === 'radiusRect'
                    ? utils.addRadiusRect(position, canvas, canvasSetting)
                    : shapeItemType === 'circle'
                    ? utils.addCircle(position, canvas, canvasSetting)
                    : shapeItemType === 'triangle'
                    ? utils.addTriangle(position, canvas, canvasSetting)
                    : utils.addShape(movingItem.src, position, canvas, canvasSetting);
                break;
            case 'line':
                utils.addShape(movingItem.src, position, canvas, canvasSetting);
                break;
            case 'sticker':
                utils.addSticker(movingItem, position, canvas, canvasSetting);
                break;
        }
        successCallback();
    }
};
