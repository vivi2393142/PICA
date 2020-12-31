import * as config from './globalConfig';
// for all pages
export const trackOutSideClick = (trackTargetNode, callback) => {
    const clickedOrNot = (e) => {
        if (!trackTargetNode.contains(e.target)) {
            callback();
            document.removeEventListener('click', clickedOrNot, true);
        }
    };
    document.addEventListener('click', clickedOrNot, true);
};

// for canvas pages
// -- init view - responsive size
const canvasSizeToDrawingArea = 0.72;
// const container = document.querySelector('.canvas-container');
export const setViewToFitWindow = (canvasSetting) => {
    const container = document.querySelector('.canvas-container');
    if (container) {
        const fixRatio = Math.min(
            (window.innerWidth * canvasSizeToDrawingArea) / canvasSetting.width,
            (window.innerHeight * canvasSizeToDrawingArea) / canvasSetting.height
        );
        container.style.width = `${fixRatio * canvasSetting.width}px`;
        container.style.height = `${fixRatio * canvasSetting.height}px`;
    }
};
export const setViewToSelectedRatio = (selectedRatio, canvasSetting) => {
    const container = document.querySelector('.canvas-container');
    container.style.width = `${(parseInt(selectedRatio) / 100) * canvasSetting.width}px`;
    container.style.height = `${(parseInt(selectedRatio) / 100) * canvasSetting.height}px`;
};
// -- init view - fabric zoom in function to fix image view quality
export const initViewZoomIn = (canvas, canvasSetting) => {
    const currentSizeRatio =
        parseInt(document.querySelector('.canvas-container').style.width) / canvasSetting.width;
    canvas.setZoom(currentSizeRatio);
    canvas.setWidth(canvasSetting.width * canvas.getZoom());
    canvas.setHeight(canvasSetting.height * canvas.getZoom());
    document.querySelectorAll('.drawingArea').forEach((item) => {
        item.style.width = '100%';
        item.style.height = '100%';
    });
};
// -- preset canvas functions
export const presetBackgroundImg = (backImg, canvas, scaleWay, scaleToWidth, scaleToHeight) => {
    backImg.setControlsVisibility({
        mb: false,
        mt: false,
        ml: false,
        mr: false,
        mtr: false,
    });
    backImg.set({
        scaleX: scaleWay === 'toWidth' ? scaleToWidth : scaleToHeight,
        scaleY: scaleWay === 'toWidth' ? scaleToWidth : scaleToHeight,
        left: 0,
    });
    scaleWay === 'toWidth' ? (backImg.lockMovementX = true) : (backImg.lockMovementY = true);
    backImg.toObject = (function (toObject) {
        return function (propertiesToInclude) {
            return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
                specialType: 'background',
            });
        };
    })(backImg.toObject);
    canvas.add(backImg);
    backImg.sendToBack();
    // bounding can't be inside canvas
    backImg.on('modified', () => {
        backImg.setCoords();
        const { top, left, width, height } = backImg.getBoundingRect();
        if (left > 0) {
            backImg.left = 0;
        }
        if (left + width < canvas.getWidth()) {
            backImg.left = canvas.getWidth() - width;
        }
        canvas.requestRenderAll();
    });
};
export const presetBackgroundElements = (canvas, canvasSetting) => {
    const backgroundObject = canvas.getObjects('image').find((x) => x.specialType === 'background');
    if (backgroundObject) {
        canvas.remove(backgroundObject);
        const scaleToWidth = canvasSetting.width / backgroundObject.width;
        const scaleToHeight = canvasSetting.height / backgroundObject.height;
        const scaleWay = scaleToWidth > scaleToHeight ? 'toWidth' : 'toHeight';
        presetBackgroundImg(backgroundObject, canvas, scaleWay, scaleToWidth, scaleToHeight);
    }
};
// -- add new components: rectangle, circle, triangle, text, image, background
const shapeRatioDivider = 600;
export const addRect = (position, canvas, canvasSetting) => {
    const shapeRatio = canvasSetting.width / shapeRatioDivider;
    const rect = new fabric.Rect({
        top: position.top,
        left: position.left,
        height: 100 * shapeRatio,
        width: 100 * shapeRatio,
        fill: config.mainColor,
        objectCaching: false,
    });
    canvas.add(rect);
    canvas.requestRenderAll();
};
export const addRadiusRect = (position, canvas, canvasSetting) => {
    const shapeRatio = canvasSetting.width / shapeRatioDivider;
    const rect = new fabric.Rect({
        top: position.top,
        left: position.left,
        height: 100 * shapeRatio,
        width: 100 * shapeRatio,
        fill: config.mainColor,
        objectCaching: false,
        rx: 15,
        ry: 15,
    });
    canvas.add(rect);
    canvas.requestRenderAll();
};
export const addCircle = (position, canvas, canvasSetting) => {
    const shapeRatio = canvasSetting.width / shapeRatioDivider;
    const circle = new fabric.Circle({
        top: position.top,
        left: position.left,
        radius: 50 * shapeRatio,
        fill: mainColor,
    });
    canvas.add(circle);
    canvas.requestRenderAll();
};
export const addTriangle = (position, canvas, canvasSetting) => {
    const shapeRatio = canvasSetting.width / shapeRatioDivider;
    const triangle = new fabric.Triangle({
        top: position.top,
        left: position.left,
        width: 100 * shapeRatio,
        height: 100 * shapeRatio,
        fill: mainColor,
    });
    canvas.add(triangle);
    canvas.requestRenderAll();
};
export const addShape = (src, position, canvas, canvasSetting) => {
    const shapeRatio = canvasSetting.width / shapeRatioDivider;
    fabric.loadSVGFromURL(src, (objects, options) => {
        const newShape = fabric.util.groupSVGElements(objects, options);
        newShape.set({
            top: position.top,
            left: position.left,
            scaleX: 2.2 * shapeRatio,
            scaleY: 2.2 * shapeRatio,
        });
        canvas.add(newShape);
        canvas.requestRenderAll();
    });
};

export const addIText = (position, canvas, canvasSetting, chosenIndex) => {
    const textRatio = canvasSetting.width / shapeRatioDivider;
    const text = new fabric.IText(config.textSetting[chosenIndex].title, {});
    text.set({
        top: position.top,
        left: position.left,
        fill: '#555555',
        fontSize: config.textSetting[chosenIndex].size * textRatio,
        fontFamily: 'Sans-serif',
        fontWeight: config.textSetting[chosenIndex].fontWeight,
    });
    canvas.add(text);
    text.setControlsVisibility({
        mb: false,
        mt: false,
        ml: false,
        mr: false,
    });
    canvas.requestRenderAll();
};
export const addImage = (target, position, canvas, canvasSetting) => {
    const scaleRatio = Math.max(
        canvasSetting.width / 4 / target.naturalWidth,
        canvasSetting.height / 4 / target.naturalHeight
    );
    fabric.Image.fromURL(
        target.src,
        (img) => {
            const oImg = img.set({
                top: position.top,
                left: position.left,
                scaleX: scaleRatio,
                scaleY: scaleRatio,
            });
            canvas.add(oImg);
            oImg.setControlsVisibility({
                mb: false,
                mt: false,
                ml: false,
                mr: false,
            });
        },
        {
            crossOrigin: 'anonymous',
        }
    );
    canvas.requestRenderAll();
};
export const addSticker = (target, position, canvas, canvasSetting) => {
    const scaleRatio = Math.max(
        canvasSetting.width / 4 / target.naturalWidth,
        canvasSetting.height / 4 / target.naturalHeight
    );
    fabric.Image.fromURL(
        target.src,
        (img) => {
            const oImg = img.set({
                top: position.top,
                left: position.left,
                scaleX: scaleRatio,
                scaleY: scaleRatio,
            });
            oImg.toObject = (function (toObject) {
                return function (propertiesToInclude) {
                    return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
                        specialType: 'sticker',
                    });
                };
            })(oImg.toObject);
            canvas.add(oImg);
            oImg.setControlsVisibility({
                mb: false,
                mt: false,
                ml: false,
                mr: false,
            });
        },
        {
            crossOrigin: 'anonymous',
        }
    );
    canvas.requestRenderAll();
};
