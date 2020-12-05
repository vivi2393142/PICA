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

    // show save status
    const showSaveStatus = () => {
        document.querySelector('.status').classList.add('showStatus');
        setTimeout(() => {
            document.querySelector('.status').classList.remove('showStatus');
        }, 3000);
    };

    const handleResponsiveSize = (container) => {
        let fixRatio = Math.min(
            (window.innerWidth * 0.72) / canvasSetting.width,
            (window.innerHeight * 0.72) / canvasSetting.height
        );
        container.style.width = `${fixRatio * canvasSetting.width}px`;
        container.style.height = `${fixRatio * canvasSetting.height}px`;
    };

    React.useEffect(() => {
        console.log(props.match.params.id);
        console.log('執行canvas use effect setting');
        firebase.loadCanvas((canvasSettingInit, canvasDataInit) => {
            setCanvasSetting(canvasSettingInit);
            setCanvasData(canvasDataInit);

            const canvasInit = new fabric.Canvas('fabric-canvas', {
                height: canvasSettingInit.height,
                width: canvasSettingInit.width,
            });

            async function presetObjectStyle() {
                // -- render initial data then clear init history
                await canvasInit.renderAll();
                setIsLoaded(false);
                canvasInit.clearHistory();
                // props.setIsLoaded(false);
                // -- preset image, iText objects style
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
                // -- listen to all changes -> update database
                canvasInit.on('object:modified', (e) => {
                    setHasUndo(canvasInit.historyUndo.length > 0);
                    setHasRedo(canvasInit.historyRedo.length > 0);
                    console.log('編輯完畢');
                });
                // TODO:處理複製剪下貼上會更新兩次的問題
                canvasInit.on('object:added', (e) => {
                    setHasUndo(canvasInit.historyUndo.length > 0);
                    setHasRedo(canvasInit.historyRedo.length > 0);
                    console.log('新增完畢');
                });
                canvasInit.on('object:removed', (e) => {
                    setHasUndo(canvasInit.historyUndo.length > 0);
                    setHasRedo(canvasInit.historyRedo.length > 0);
                    console.log('移除完畢');
                });
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
                canvasInit.on('object:scaled', (e) => {
                    console.log('object:scaled');
                });
                canvasInit.on('drop', (e) => {
                    dropItem(e);
                    console.log('監聽到drop');
                });
            }
            canvasInit.loadFromJSON(canvasDataInit, presetObjectStyle);
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

            // -- set canvas
            setCanvas(canvasInit);

            // -- preset responsive canvas size
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
            const dropItem = (e) => {
                console.log(movingItem);
                const currentSizeRatio =
                    parseInt(document.querySelector('.canvas-container').style.width) /
                    canvasSettingInit.width;
                const { offsetX, offsetY } = e.e;
                const src = movingItem.src;
                if (movingItem.parentNode.classList.contains('sidebarUnfoldImg')) {
                    fabric.Image.fromURL(
                        src,
                        (img) => {
                            const imgItem = img.set({
                                scaleX: movingItem.width / movingItem.naturalWidth,
                                scaleY: movingItem.height / movingItem.naturalHeight,
                                top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                                left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                            });
                            canvasInit.add(imgItem);
                            console.log(imgItem);
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
                    const textItem = new fabric.IText(currentTextSetting.title, {
                        top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                        left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                        fill: '#555555',
                        fontSize: currentTextSetting.size,
                        fontWeight: currentTextSetting.fontWeight,
                    });
                    canvasInit.add(textItem);
                    canvasInit.requestRenderAll();
                } else if (movingItem.parentNode.classList.contains('sidebarUnfoldShape')) {
                    if (movingItem.classList.contains('rectShape')) {
                        const rectItem = new fabric.Rect({
                            top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                            left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                            height: 100,
                            width: 100,
                            fill: '#e89a4f',
                        });
                        canvasInit.add(rectItem);
                        canvasInit.requestRenderAll();
                    } else if (movingItem.classList.contains('circleShape')) {
                        const circleItem = new fabric.Circle({
                            top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                            left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                            radius: 50,
                            fill: '#e89a4f',
                        });
                        canvasInit.add(circleItem);
                        canvasInit.requestRenderAll();
                    } else if (movingItem.classList.contains('triangleShape')) {
                        const triangleItem = new fabric.Triangle({
                            top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                            left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                            width: 100,
                            height: 100,
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
                                scaleX: 2.2,
                                scaleY: 2.2,
                                id: 'shape',
                            });
                            canvasInit.add(abnormalShapeItem);
                            canvasInit.requestRenderAll();
                        });
                    }
                } else if (movingItem.parentNode.classList.contains('sidebarUnfoldLine')) {
                    fabric.loadSVGFromURL(src, (objects, options) => {
                        const svgItem = fabric.util.groupSVGElements(objects, options);
                        svgItem.set({
                            top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                            left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                            scaleX: 2.2,
                            scaleY: 2.2,
                            id: 'shape',
                        });
                        canvasInit.add(svgItem);
                        canvasInit.requestRenderAll();
                    });
                } else if (movingItem.parentNode.classList.contains('sidebarUnfoldSticker')) {
                    fabric.Image.fromURL(
                        src,
                        (img) => {
                            const stickerItem = img.set({
                                scaleX: movingItem.width / movingItem.naturalWidth,
                                scaleY: movingItem.height / movingItem.naturalHeight,
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

            firebase.listenCanvas(props.match.params.id, showSaveStatus);
        }, props.match.params.id);
    }, []);

    const drawingAreaSettings = {
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
            <Banner drawingAreaSettings={drawingAreaSettings} />
            <MainBoard drawingAreaSettings={drawingAreaSettings} />
        </div>
    );
};

Canvas.propTypes = {
    match: PropTypes.object.isRequired,
};

export default Canvas;

// const dataTest = {
//     version: '4.2.0',
//     objects: [
//         {
//             type: 'rect',
//             version: '4.2.0',
//             originX: 'left',
//             originY: 'top',
//             left: null,
//             top: null,
//             width: 100,
//             height: 100,
//             fill: '#e89a4f',
//             stroke: null,
//             strokeWidth: 1,
//             strokeDashArray: null,
//             strokeLineCap: 'butt',
//             strokeDashOffset: 0,
//             strokeLineJoin: 'miter',
//             strokeMiterLimit: 4,
//             scaleX: 1,
//             scaleY: 1,
//             angle: 0,
//             flipX: false,
//             flipY: false,
//             opacity: 1,
//             shadow: null,
//             visible: true,
//             backgroundColor: '',
//             fillRule: 'nonzero',
//             paintFirst: 'fill',
//             globalCompositeOperation: 'source-over',
//             skewX: 0,
//             skewY: 0,
//             rx: 0,
//             ry: 0,
//         },
//     ],
//     background: '#fff',
// };
