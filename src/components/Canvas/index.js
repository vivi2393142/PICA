import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/canvas.scss';
import MainBoard from './MainBoard';
import Banner from './Banner';
import initAligningGuidelines from '../../aligning_guidelines.js';
import * as backImg from '../../img/background';
import * as firebase from '../../firebase';
import Loader from '../Loader';

// export default App;
const Canvas = (props) => {
    const [isLoaded, setIsLoaded] = React.useState(true);
    const [canvas, setCanvas] = React.useState({});
    const [canvasSetting, setCanvasSetting] = React.useState({});
    const [canvasData, setCanvasData] = React.useState({});
    const [ratioSelectValue, setRatioSelectValue] = React.useState('auto');
    const [hasUndo, setHasUndo] = React.useState(false);
    const [hasRedo, setHasRedo] = React.useState(false);
    const [activeObj, setActiveObj] = React.useState({});
    const [saveDragItem, setSaveDragItem] = React.useState({});
    const textSetting = [
        { title: '雙擊以編輯標題', size: 36, fontWeight: 'bold' },
        { title: '雙擊以編輯副標', size: 28, fontWeight: 'normal' },
        { title: '雙擊以編輯內文', size: 18, fontWeight: 'normal' },
    ];
    const [uploadedFiles, setUploadedFiles] = React.useState([]);
    const [hasBackColor, setHasBackColor] = React.useState(false);

    // handleSaveFile
    const handleSaveFile = (canvas, canvasSetting) => {
        // console.log(canvas);
        // allSettings.canvas.discardActiveObject().renderAll();
        // firebase.testSaveDataURL(dataURL, props.fileId,);
        firebase.saveCanvasData(canvas, canvasSetting, props.match.params.id);
    };

    // show save status
    const showSaveStatus = () => {
        // if (document.querySelector('.status').classList.contains('showStatus')) {
        //     document.querySelector('.status').classList.remove('showStatus');
        // }
        document.querySelector('.status').classList.add('showStatus');
        setTimeout(() => {
            document.querySelector('.status').classList.remove('showStatus');
        }, 3000);
    };

    // handle responsive size
    const handleResponsiveSize = (container) => {
        let fixRatio = Math.min(
            (window.innerWidth * 0.72) / canvasSetting.width,
            (window.innerHeight * 0.72) / canvasSetting.height
        );
        container.style.width = `${fixRatio * canvasSetting.width}px`;
        container.style.height = `${fixRatio * canvasSetting.height}px`;
    };

    React.useEffect(() => {
        // get firebase data according to URL params
        firebase.loadCanvas((canvasSettingInit, canvasDataInit) => {
            // set canvas setting state by firebase canvas data
            setCanvasSetting(canvasSettingInit);
            setCanvasData(canvasDataInit);

            // create new canvas then load firebase data in
            const canvasInit = new fabric.Canvas('fabric-canvas', {
                height: canvasSettingInit.height,
                width: canvasSettingInit.width,
            });
            canvasInit.loadFromJSON(canvasDataInit, presetObjectStyle);

            async function presetObjectStyle() {
                // -- render initial data then clear init history
                await canvasInit.renderAll();
                // ---- remove loader after finishing render canvas
                setIsLoaded(false);
                canvasInit.clearHistory();

                // preset image, iText objects style
                let imgObjects = canvasInit.getObjects('image');
                let texObjects = canvasInit.getObjects('i-text');
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

                // fabric listeners
                // -- listen to all changes -> update database
                canvasInit.on('object:modified', (e) => {
                    if (e.target) {
                        if (e.target.id === 'cropBackground' || e.target.id === 'cropbox') {
                            return;
                        }
                    }
                    setHasUndo(canvasInit.historyUndo.length > 0);
                    setHasRedo(canvasInit.historyRedo.length > 0);
                    console.log('編輯完畢');
                    handleSaveFile(canvasInit, canvasSettingInit);
                });
                // TODO:處理複製剪下貼上會更新兩次的問題
                canvasInit.on('object:added', (e) => {
                    if (e.target) {
                        if (e.target.id === 'cropBackground' || e.target.id === 'cropbox') {
                            return;
                        }
                    }
                    setHasUndo(canvasInit.historyUndo.length > 0);
                    setHasRedo(canvasInit.historyRedo.length > 0);
                    console.log('新增完畢');
                    handleSaveFile(canvasInit, canvasSettingInit);
                });
                canvasInit.on('object:removed', (e) => {
                    if (e.target) {
                        if (e.target.id === 'cropBackground') {
                            return;
                        }
                    }
                    // e.target.id === 'cropbox' regards as crop event
                    setHasUndo(canvasInit.historyUndo.length > 0);
                    setHasRedo(canvasInit.historyRedo.length > 0);
                    console.log('移除完畢');
                    handleSaveFile(canvasInit, canvasSettingInit);
                });
                // -- listen to all changes -> set active obj
                canvasInit.on('selection:created', (e) => {
                    setActiveObj(e.target);
                    // console.log(e.target.type);
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
                    // console.log('監聽到drop');
                });
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
            // -- customize border style
            const customBorder = {
                borderColor: 'rgba(0,0,0,0.25)',
                cornerColor: 'rgba(0,0,0,0.25)',
                cornerStrokeColor: 'rgba(0,0,0,0.25)',
                cornerSize: 8,
                cornerStyle: 'circle',
                cornerColor: 'white',
            };
            fabric.Object.prototype.set(customBorder);

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
            let fixRatio = Math.min(
                (window.innerWidth * 0.72) / canvasSettingInit.width,
                (window.innerHeight * 0.72) / canvasSettingInit.height
            );
            container.style.width = `${fixRatio * canvasSettingInit.width}px`;
            container.style.height = `${fixRatio * canvasSettingInit.height}px`;

            // dnd components event
            // --- save the dragging target
            let itemDragOffset = { offsetX: 0, offsetY: 0 };
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
                const currentSizeRatio =
                    parseInt(document.querySelector('.canvas-container').style.width) /
                    canvas.width;
                const { offsetX, offsetY } = e.e;
                const src = movingItem.src;
                const scaleRatio = Math.max(
                    canvas.width / 4 / movingItem.naturalWidth,
                    canvas.height / 4 / movingItem.naturalHeight
                );
                if (
                    movingItem.parentNode.parentNode.classList.contains('sidebarUnfoldImg') ||
                    movingItem.parentNode.parentNode.classList.contains('unfoldItemImgWrapper')
                ) {
                    fabric.Image.fromURL(
                        src,
                        (img) => {
                            const imgItem = img.set({
                                scaleX: scaleRatio,
                                scaleY: scaleRatio,
                                top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                                left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
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
                    const textRatio = canvas.width / 600;
                    const textItem = new fabric.IText(currentTextSetting.title, {
                        top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                        left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                        fill: '#555555',
                        fontSize: currentTextSetting.size * textRatio,
                        fontWeight: currentTextSetting.fontWeight,
                    });
                    canvasInit.add(textItem);
                    canvasInit.requestRenderAll();
                } else if (movingItem.parentNode.classList.contains('sidebarUnfoldShape')) {
                    const shapeRatio = canvas.width / 600;
                    if (movingItem.classList.contains('rectShape')) {
                        const rectItem = new fabric.Rect({
                            top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                            left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                            height: 100 * shapeRatio,
                            width: 100 * shapeRatio,
                            fill: '#e89a4f',
                        });
                        canvasInit.add(rectItem);
                        canvasInit.requestRenderAll();
                    } else if (movingItem.classList.contains('circleShape')) {
                        const circleItem = new fabric.Circle({
                            top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                            left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                            radius: 50 * shapeRatio,
                            fill: '#e89a4f',
                        });
                        canvasInit.add(circleItem);
                        canvasInit.requestRenderAll();
                    } else if (movingItem.classList.contains('triangleShape')) {
                        const triangleItem = new fabric.Triangle({
                            top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                            left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
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
                                top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                                left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                                scaleX: 2.2 * shapeRatio,
                                scaleY: 2.2 * shapeRatio,
                                id: 'shape',
                            });
                            canvasInit.add(abnormalShapeItem);
                            canvasInit.requestRenderAll();
                        });
                    }
                } else if (movingItem.parentNode.classList.contains('sidebarUnfoldLine')) {
                    const lineRatio = canvas.width / 600;
                    fabric.loadSVGFromURL(src, (objects, options) => {
                        const svgItem = fabric.util.groupSVGElements(objects, options);
                        svgItem.set({
                            top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                            left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                            scaleX: 2.2 * lineRatio,
                            scaleY: 2.2 * lineRatio,
                            id: 'shape',
                        });
                        canvasInit.add(svgItem);
                        canvasInit.requestRenderAll();
                    });
                } else if (
                    movingItem.parentNode.parentNode.classList.contains('sidebarUnfoldSticker')
                ) {
                    fabric.Image.fromURL(
                        src,
                        (img) => {
                            const stickerItem = img.set({
                                scaleX: scaleRatio,
                                scaleY: scaleRatio,
                                top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                                left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                                id: 'sticker',
                            });
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
            };

            // show save status when firebase find new update
            firebase.listenCanvas(props.match.params.id, showSaveStatus, (files) =>
                setUploadedFiles(files)
            );
        }, props.match.params.id);
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
        hasUndo,
        setHasUndo,
        hasRedo,
        setHasRedo,
        activeObj,
        setActiveObj,
        saveDragItem,
        handleResponsiveSize,
        textSetting,
        uploadedFiles,
        hasBackColor,
        setHasBackColor,
    };

    const Background = () => {
        return (
            <div className='backImages'>
                <backImg.BackY1 className='backImg backY1' />
                <backImg.BackY2 className='backImg backY2' />
                {/* <backImg.BackY3 className='backImg' /> */}
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
            <Background />
            <Banner allSettings={allSettings} fileId={props.match.params.id} />
            <MainBoard
                allSettings={allSettings}
                currentUser={props.currentUser}
                fileId={props.match.params.id}
            />
        </div>
    );
};

Canvas.propTypes = {
    match: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
};

export default Canvas;
