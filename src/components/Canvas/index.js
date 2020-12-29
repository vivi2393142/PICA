import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/canvas.scss';
import MainBoard from './MainBoard';
import Banner from './Banner';
import initAligningGuidelines from '../../aligning_guidelines.js';
import * as backImg from '../../img/background';
import * as firebase from '../../utils/firebase.js';
import Loader from '../Loader';
import { useHistory } from 'react-router-dom';
const canvasSizeOptions = [
    { name: '自訂尺寸', type: 'custom', width: 1800, height: 1600 },
    { name: '橫式海報', type: 'poster', width: 1728, height: 1296, mmW: 609, mmH: 457 },
    { name: '網頁', type: 'web', width: 1280, height: 1024 },
    { name: 'Instagram', type: 'instagram', width: 1080, height: 1080 },
    { name: '橫式A4', type: 'a4', width: 842, height: 595, mmW: 297, mmH: 210 },
    { name: '明信片', type: 'postCard', width: 560, height: 288, mmW: 198, mmH: 102 },
    { name: '名片', type: 'nameCard', width: 255, height: 153, mmW: 90, mmH: 54 },
];

// export default App;
const Canvas = (props) => {
    const history = useHistory();
    const [isLoaded, setIsLoaded] = React.useState(true);
    const [canvas, setCanvas] = React.useState({});
    const [canvasSetting, setCanvasSetting] = React.useState({});
    const [canvasData, setCanvasData] = React.useState({});
    const [ratioSelectValue, setRatioSelectValue] = React.useState('auto');
    const [activeObj, setActiveObj] = React.useState({});
    const [saveDragItem, setSaveDragItem] = React.useState({});
    const [uploadedFiles, setUploadedFiles] = React.useState([]);
    const [isFocusInput, setIsFocusInput] = React.useState(false);
    const textSetting = [
        { title: '雙擊以編輯標題', size: 36, fontWeight: 'bold' },
        { title: '雙擊以編輯副標', size: 28, fontWeight: 'normal' },
        { title: '雙擊以編輯內文', size: 18, fontWeight: 'normal' },
    ];
    // handleSaveFile
    const handleSaveFile = (canvas, canvasSetting) => {
        firebase.saveCanvasData(canvas, canvasSetting, props.match.params.id);
    };
    // show save status
    const showSaveStatus = () => {
        if (document.querySelector('.status')) {
            document.querySelector('.status').classList.add('showStatus');
            setTimeout(() => {
                if (document.querySelector('.status') !== null) {
                    document.querySelector('.status').classList.remove('showStatus');
                }
            }, 3000);
        }
    };

    // handle responsive size
    const handleResponsiveSize = (container, canvasSetting) => {
        if (container) {
            const fixRatio = Math.min(
                (window.innerWidth * 0.72) / canvasSetting.width,
                (window.innerHeight * 0.72) / canvasSetting.height
            );
            container.style.width = `${fixRatio * canvasSetting.width}px`;
            container.style.height = `${fixRatio * canvasSetting.height}px`;
        }
    };

    // preset backgroundImg function
    const presetBackgroundImg = (
        backImg,
        canvas,
        canvasSetting,
        scaleWay,
        scaleToWidth,
        scaleToHeight
    ) => {
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
        if (scaleWay === 'toWidth') {
            backImg.lockMovementX = true;
        } else {
            backImg.lockMovementY = true;
        }
        backImg.toObject = (function (toObject) {
            return function (propertiesToInclude) {
                return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
                    specialType: 'background', //my custom property
                });
            };
        })(backImg.toObject);
        canvas.add(backImg);
        backImg.sendToBack();
        // bounding can't be inside canvas
        backImg.on('modified', () => {
            const currentSizeRatio =
                parseInt(document.querySelector('.canvas-container').style.width) /
                canvasSetting.width;
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

    React.useEffect(() => {
        // ---- if currentUser is not the one
        if (
            canvasSetting.userEmail &&
            props.currentUser.email &&
            canvasSetting.userEmail !== props.currentUser.email
        ) {
            history.push('/main/explore');
        }
    }, [props.currentUser, canvasSetting]);

    React.useEffect(() => {
        // get firebase data according to URL params
        const FontFaceObserver = require('fontfaceobserver');
        const fontsArray = ['JetBrains Mono', 'Raleway', 'Montserrat Alternates'];
        Promise.all(fontsArray.map((font) => new FontFaceObserver(font).load())).then(() => {});
        firebase.loadCanvas(
            canvas,
            (canvasSettingInit, canvasDataInit, snapshotInit) => {
                // set canvas setting state by firebase canvas data
                setCanvasSetting(canvasSettingInit);
                setCanvasData(canvasDataInit);
                // create new canvas then load firebase data in
                const canvasInit = new fabric.Canvas('fabric-canvas', {
                    height: canvasSettingInit.height,
                    width: canvasSettingInit.width,
                    objectChaching: false,
                });
                canvasInit.offHistory();
                canvasInit.loadFromJSON(canvasDataInit, presetObjectStyle);
                async function presetObjectStyle() {
                    // -- render initial data then clear init history
                    await canvasInit.renderAll();
                    // ---- remove loader after finishing render canvas
                    setIsLoaded(false);
                    // preset image & iText objects style
                    const imgObjects = canvasInit.getObjects('image');
                    const texObjects = canvasInit.getObjects('i-text');
                    imgObjects.forEach((object) => {
                        object.setControlsVisibility({
                            mb: false,
                            mt: false,
                            ml: false,
                            mr: false,
                        });
                    });
                    texObjects.forEach((object) => {
                        object.setControlsVisibility({
                            mb: false,
                            mt: false,
                            ml: false,
                            mr: false,
                        });
                    });
                    // preset background image object style
                    const backgroundObject = canvasInit
                        .getObjects('image')
                        .find((x) => x.specialType === 'background');
                    if (backgroundObject) {
                        canvasInit.remove(backgroundObject);
                        const scaleToWidth = canvasSettingInit.width / backgroundObject.width;
                        const scaleToHeight = canvasSettingInit.height / backgroundObject.height;
                        const scaleWay = scaleToWidth > scaleToHeight ? 'toWidth' : 'toHeight';
                        presetBackgroundImg(
                            backgroundObject,
                            canvasInit,
                            canvasSettingInit,
                            scaleWay,
                            scaleToWidth,
                            scaleToHeight
                        );
                    }
                    // preset shape and sticker special type
                    const stickerObjects = canvasInit
                        .getObjects('image')
                        .filter((x) => x.specialType === 'sticker');
                    if (stickerObjects.length !== 0) {
                        stickerObjects.forEach((sticker) => {
                            canvasInit.remove(sticker);
                            sticker.toObject = (function (toObject) {
                                return function (propertiesToInclude) {
                                    return fabric.util.object.extend(
                                        toObject.call(this, propertiesToInclude),
                                        {
                                            specialType: 'sticker', //my custom property
                                        }
                                    );
                                };
                            })(sticker.toObject);
                            canvasInit.add(sticker);
                            sticker.setControlsVisibility({
                                mb: false,
                                mt: false,
                                ml: false,
                                mr: false,
                            });
                        });
                    }
                    // fabric listeners
                    // -- listen to all changes -> update database
                    canvasInit.on('object:modified', (e) => {
                        if (e.target) {
                            if (
                                e.target.specialType === 'cropBackground' ||
                                e.target.specialType === 'cropbox'
                            ) {
                                return;
                            }
                        }
                        console.log('編輯完畢');
                        handleSaveFile(canvasInit, canvasSettingInit);
                    });
                    // TODO:處理複製剪下貼上會更新兩次的問題
                    canvasInit.on('object:added', (e) => {
                        if (e.target) {
                            if (
                                e.target.specialType === 'cropBackground' ||
                                e.target.specialType === 'cropbox'
                            ) {
                                return;
                            }
                        }
                        console.log('新增完畢');
                        handleSaveFile(canvasInit, canvasSettingInit);
                    });
                    canvasInit.on('object:removed', (e) => {
                        if (e.target) {
                            if (e.target.specialType === 'cropBackground') {
                                return;
                            }
                        }
                        console.log('移除完畢');
                        handleSaveFile(canvasInit, canvasSettingInit);
                    });

                    // -- listen to all changes -> set active obj
                    canvasInit.on('selection:created', (e) => {
                        setActiveObj(e.target);
                    });
                    canvasInit.on('selection:updated', (e) => {
                        setActiveObj(e.target);
                    });
                    canvasInit.on('selection:cleared', (e) => {
                        setActiveObj({});
                    });
                    // -- listen to drop event -> execute drop function
                    canvasInit.on('drop', (e) => {
                        dropItem(e, canvasInit);
                    });
                    canvasInit.onHistory();
                    canvasInit.clearHistory();
                }
                //save dataURL if non
                if (!snapshotInit) {
                    firebase.firstSavaDataURL(canvasInit, props.match.params.id);
                }
                // preset fabric custom styles
                // -- init align guide lines extensions
                initAligningGuidelines(canvasInit);
                // -- customize selection style
                canvasInit.selectionColor = 'rgba(0,0,0,0.03)';
                canvasInit.selectionBorderColor = 'rgba(0,0,0,0.25)';
                canvasInit.selectionLineWidth = 1;
                // -- set layers in canvas
                canvasInit.preserveObjectStacking = true;
                // set canvas
                setCanvas(canvasInit);
                // responsive canvas size
                const container = document.querySelector('.canvas-container');
                container.style.border = '2.8rem solid transparent';
                document.querySelector('.lower-canvas').style.width = '100%';
                document.querySelector('.lower-canvas').style.height = '100%';
                document.querySelector('.upper-canvas').style.width = '100%';
                document.querySelector('.upper-canvas').style.height = '100%';
                // -- default view ratio: auto
                const fixRatio = Math.min(
                    (window.innerWidth * 0.72) / canvasSettingInit.width,
                    (window.innerHeight * 0.72) / canvasSettingInit.height
                );
                container.style.width = `${fixRatio * canvasSettingInit.width}px`;
                container.style.height = `${fixRatio * canvasSettingInit.height}px`;

                // -- customize border style
                // console.log(fixRatio);
                const customBorder = {
                    borderColor: 'rgba(0,0,0,0.25)',
                    cornerColor: 'rgba(0,0,0,0.25)',
                    cornerStrokeColor: 'rgba(0,0,0,0.25)',
                    cornerSize: 10,
                    cornerStyle: 'circle',
                    cornerColor: 'white',
                };
                fabric.Object.prototype.set(customBorder);

                // dnd components event
                // --- save the dragging target
                const itemDragOffset = { offsetX: 0, offsetY: 0 };
                let movingItem = {};
                const saveDragItemFunc = (e) => {
                    if (e.target.draggable) {
                        itemDragOffset.offsetX =
                            e.clientX - e.target.offsetParent.offsetLeft - e.target.offsetLeft;
                        itemDragOffset.offsetY =
                            e.clientY - e.target.offsetParent.offsetTop - e.target.offsetTop;
                        movingItem = e.target;
                    }
                };
                setSaveDragItem({ func: saveDragItemFunc });
                // --- listener to drop then add the dragging one
                const dropItem = (e, canvas) => {
                    console.log(Object.keys(movingItem).length);
                    if (Object.keys(movingItem).length !== 0) {
                        const currentSizeRatio =
                            parseInt(document.querySelector('.canvas-container').style.width) /
                            canvasSettingInit.width;
                        const { offsetX, offsetY } = e.e;
                        const src = movingItem.src;
                        const scaleRatio = Math.max(
                            canvasSettingInit.width / 4 / movingItem.naturalWidth,
                            canvasSettingInit.height / 4 / movingItem.naturalHeight
                        );
                        if (
                            movingItem.parentNode.parentNode.parentNode.classList.contains(
                                'sidebarUnfoldImg'
                            ) ||
                            movingItem.parentNode.classList.contains('unfoldItemImgWrapper')
                        ) {
                            const layoutZoomRation =
                                parseInt(movingItem.parentNode.style.width) / 100;
                            fabric.Image.fromURL(
                                src,
                                (img) => {
                                    const imgItem = img.set({
                                        scaleX: scaleRatio,
                                        scaleY: scaleRatio,
                                        top:
                                            (offsetY - itemDragOffset.offsetY * layoutZoomRation) /
                                            currentSizeRatio,
                                        left:
                                            (offsetX - itemDragOffset.offsetX * layoutZoomRation) /
                                            currentSizeRatio,
                                    });
                                    canvasInit.add(imgItem);
                                    imgItem.setControlsVisibility({
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
                            canvasInit.requestRenderAll();
                        } else if (movingItem.parentNode.classList.contains('sidebarUnfoldText')) {
                            let currentTextSetting = {};
                            movingItem.classList.contains('addTextBig')
                                ? (currentTextSetting = textSetting[0])
                                : movingItem.classList.contains('addTextMiddle')
                                ? (currentTextSetting = textSetting[1])
                                : movingItem.classList.contains('addTextSmall')
                                ? (currentTextSetting = textSetting[2])
                                : null;
                            const textRatio = canvasSettingInit.width / 600;
                            const textItem = new fabric.IText(currentTextSetting.title, {
                                top: (offsetY - itemDragOffset.offsetY) / currentSizeRatio,
                                left: (offsetX - itemDragOffset.offsetX) / currentSizeRatio,
                                fill: '#555555',
                                fontSize: currentTextSetting.size * textRatio,
                                fontWeight: currentTextSetting.fontWeight,
                            });
                            canvasInit.add(textItem);
                            canvasInit.requestRenderAll();
                        } else if (movingItem.parentNode.classList.contains('sidebarUnfoldShape')) {
                            const shapeRatio = canvasSettingInit.width / 600;
                            if (movingItem.classList.contains('rectShape')) {
                                const rectItem = new fabric.Rect({
                                    top: (offsetY - itemDragOffset.offsetY) / currentSizeRatio,
                                    left: (offsetX - itemDragOffset.offsetX) / currentSizeRatio,
                                    height: 100 * shapeRatio,
                                    width: 100 * shapeRatio,
                                    fill: '#e89a4f',
                                });
                                canvasInit.add(rectItem);
                                canvasInit.requestRenderAll();
                            } else if (movingItem.classList.contains('radiusRectShape')) {
                                const rectItem = new fabric.Rect({
                                    top: (offsetY - itemDragOffset.offsetY) / currentSizeRatio,
                                    left: (offsetX - itemDragOffset.offsetX) / currentSizeRatio,
                                    height: 100 * shapeRatio,
                                    width: 100 * shapeRatio,
                                    rx: 15,
                                    ry: 15,
                                    fill: '#e89a4f',
                                });
                                canvasInit.add(rectItem);
                                canvasInit.requestRenderAll();
                            } else if (movingItem.classList.contains('circleShape')) {
                                const circleItem = new fabric.Circle({
                                    top: (offsetY - itemDragOffset.offsetY) / currentSizeRatio,
                                    left: (offsetX - itemDragOffset.offsetX) / currentSizeRatio,
                                    radius: 50 * shapeRatio,
                                    fill: '#e89a4f',
                                });
                                canvasInit.add(circleItem);
                                canvasInit.requestRenderAll();
                            } else if (movingItem.classList.contains('triangleShape')) {
                                const triangleItem = new fabric.Triangle({
                                    top: (offsetY - itemDragOffset.offsetY) / currentSizeRatio,
                                    left: (offsetX - itemDragOffset.offsetX) / currentSizeRatio,
                                    width: 100 * shapeRatio,
                                    height: 100 * shapeRatio,
                                    fill: '#e89a4f',
                                });
                                canvasInit.add(triangleItem);
                                canvasInit.requestRenderAll();
                            } else if (movingItem.classList.contains('abnormalShape')) {
                                fabric.loadSVGFromURL(src, (objects, options) => {
                                    const abnormalShapeItem = fabric.util.groupSVGElements(
                                        objects,
                                        options
                                    );
                                    abnormalShapeItem.set({
                                        top: (offsetY - itemDragOffset.offsetY) / currentSizeRatio,
                                        left: (offsetX - itemDragOffset.offsetX) / currentSizeRatio,
                                        scaleX: 2.2 * shapeRatio,
                                        scaleY: 2.2 * shapeRatio,
                                        // specialType: 'shape',
                                    });
                                    canvasInit.add(abnormalShapeItem);
                                    canvasInit.requestRenderAll();
                                });
                            }
                        } else if (movingItem.parentNode.classList.contains('sidebarUnfoldLine')) {
                            const lineRatio = canvasSettingInit.width / 600;
                            fabric.loadSVGFromURL(src, (objects, options) => {
                                const svgItem = fabric.util.groupSVGElements(objects, options);
                                svgItem.set({
                                    top: (offsetY - itemDragOffset.offsetY) / currentSizeRatio,
                                    left: (offsetX - itemDragOffset.offsetX) / currentSizeRatio,
                                    scaleX: 2.2 * lineRatio,
                                    scaleY: 2.2 * lineRatio,
                                    // specialType: 'shape',
                                });
                                canvasInit.add(svgItem);
                                canvasInit.requestRenderAll();
                            });
                        } else if (
                            movingItem.parentNode.parentNode.parentNode.classList.contains(
                                'sidebarUnfoldSticker'
                            )
                        ) {
                            const layoutZoomRation =
                                parseInt(movingItem.parentNode.style.width) / 100;
                            fabric.Image.fromURL(
                                src,
                                (img) => {
                                    const stickerItem = img.set({
                                        scaleX: scaleRatio,
                                        scaleY: scaleRatio,
                                        top:
                                            (offsetY - itemDragOffset.offsetY * layoutZoomRation) /
                                            currentSizeRatio,
                                        left:
                                            (offsetX - itemDragOffset.offsetX * layoutZoomRation) /
                                            currentSizeRatio,
                                        specialType: 'sticker',
                                    });
                                    stickerItem.toObject = (function (toObject) {
                                        return function (propertiesToInclude) {
                                            return fabric.util.object.extend(
                                                toObject.call(this, propertiesToInclude),
                                                {
                                                    specialType: 'sticker', //my custom property
                                                }
                                            );
                                        };
                                    })(stickerItem.toObject);
                                    canvasInit.add(stickerItem);
                                    stickerItem.setControlsVisibility({
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
                            canvasInit.requestRenderAll();
                        }
                        movingItem = {};
                    }
                };
                const currentSizeRatio =
                    parseInt(document.querySelector('.canvas-container').style.width) /
                    canvasSettingInit.width;
                canvasInit.setZoom(currentSizeRatio);
                // console.log(canvasInit.getZoom());
                canvasInit.setWidth(canvasSettingInit.width * canvasInit.getZoom());
                canvasInit.setHeight(canvasSettingInit.height * canvasInit.getZoom());
                document.querySelectorAll('.drawingArea').forEach((item) => {
                    item.style.width = '100%';
                    item.style.height = '100%';
                });
                // show save status when firebase find new update
                firebase.listenCanvas(props.match.params.id, showSaveStatus, (files) =>
                    setUploadedFiles(files)
                );
            },
            props.match.params.id
        );
    }, []);

    const allSettings = {
        canvasSetting,
        setCanvasSetting,
        canvasData,
        setCanvasData,
        canvasSetting,
        setCanvasSetting,
        canvas,
        setCanvas,
        ratioSelectValue,
        setRatioSelectValue,
        activeObj,
        setActiveObj,
        saveDragItem,
        handleResponsiveSize,
        textSetting,
        uploadedFiles,
        // hasBackColor,
        // setHasBackColor,
        presetBackgroundImg,
    };

    const Background = () => {
        return (
            <div className='backImages'>
                <backImg.BackY1 className='backImg backY1' />
                <backImg.BackY2 className='backImg backY2' />
                <backImg.BackW1 className='backImg backW1' />
                <backImg.BackW2 className='backImg backW2' />
                <backImg.BackW3 className='backImg backW3' />
                <backImg.BackW4 className='backImg backW4' />
                <backImg.BackG1 className='backImg backG1' />
                <backImg.BackG2 className='backImg backG2' />
                <backImg.BackL1 className='backImg backL1' />
                <backImg.BackL2 className='backImg backL2' />
            </div>
        );
    };

    // render
    return (
        <div className='Canvas'>
            {isLoaded ? <Loader></Loader> : null}
            {/* <div className='sidebarCover'>cover</div> */}
            <Background />
            <Banner
                allSettings={allSettings}
                fileId={props.match.params.id}
                currentUser={props.currentUser}
                setIsFocusInput={setIsFocusInput}
            />
            <MainBoard
                allSettings={allSettings}
                currentUser={props.currentUser}
                fileId={props.match.params.id}
                isFocusInput={isFocusInput}
                setIsFocusInput={setIsFocusInput}
            />
        </div>
    );
};

Canvas.propTypes = {
    match: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
};

export default Canvas;
