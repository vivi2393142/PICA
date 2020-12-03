import React from 'react';
import PropTypes from 'prop-types';
import DrawingArea from './DrawingArea';
import Sidebar from './Sidebar';
import ComponentsSelection from './ComponentsSelection/index';

const MainBoard = (props) => {
    const allSettings = props.drawingAreaSettings;
    const [ratioSelectValue, setRatioSelectValue] = React.useState('auto');
    const [canvas, setCanvas] = React.useState({});
    const [activeObj, setActiveObj] = React.useState({});
    const [hasUndo, setHasUndo] = React.useState(false);
    const [hasRedo, setHasRedo] = React.useState(false);
    const [currentSidebar, setCurrentSidebar] = React.useState('');
    const textSetting = [
        { title: '雙擊以編輯標題', size: 36, fontWeight: 'bold' },
        { title: '雙擊以編輯副標', size: 28, fontWeight: 'normal' },
        { title: '雙擊以編輯內文', size: 18, fontWeight: 'normal' },
    ];
    // -- track outside click event
    const trackOutSideClick = (childElement, callback) => {
        const clickedOrNot = (e) => {
            if (!childElement.parentNode.contains(e.target)) {
                callback();
                document.removeEventListener('click', clickedOrNot, true);
            }
        };
        document.addEventListener('click', clickedOrNot, true);
    };
    // responsive view handling
    const handleResponsiveSize = (container) => {
        let fixRatio = Math.min(
            (window.innerWidth * 0.7) / allSettings.canvasSetting.width,
            (window.innerHeight * 0.7) / allSettings.canvasSetting.height
        );
        container.style.width = `${fixRatio * allSettings.canvasSetting.width}px`;
        container.style.height = `${fixRatio * allSettings.canvasSetting.height}px`;
    };
    const handleRatioSelect = (e) => {
        setRatioSelectValue(e.target.value);
        const container = document.querySelector('.canvas-container');
        if (e.target.value === 'auto') {
            handleResponsiveSize(container);
        } else {
            container.style.width = `${
                (parseInt(e.target.value) / 100) * allSettings.canvasSetting.width
            }px`;
            container.style.height = `${
                (parseInt(e.target.value) / 100) * allSettings.canvasSetting.height
            }px`;
        }
        // -- zoom canvas without quality lose
        zoomCanvas(canvas);
    };
    const zoomCanvas = (canvas) => {
        const currentSizeRatio =
            parseInt(document.querySelector('.canvas-container').style.width) /
            allSettings.canvasSetting.width;
        canvas.setZoom(currentSizeRatio);
        canvas.setWidth(allSettings.canvasSetting.width * canvas.getZoom());
        canvas.setHeight(allSettings.canvasSetting.height * canvas.getZoom());
    };
    const ratioOptions = [10, 25, 50, 75, 100, 125, 200, 300];
    const givenOptions = ratioOptions.map((item, index) => {
        return (
            <option key={index} value={item}>
                {item}%
            </option>
        );
    });
    // drag to add event
    const [saveDragItem, setSaveDragItem] = React.useState({});
    React.useEffect(() => {
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
            const currentSizeRatio =
                parseInt(document.querySelector('.canvas-container').style.width) /
                allSettings.canvasSetting.width;
            const { offsetX, offsetY } = e.e;
            const src = movingItem.src;
            if (movingItem.parentNode.classList.contains('sidebarUnfoldImg')) {
                fabric.Image.fromURL(
                    src,
                    (img) => {
                        const imtItem = img.set({
                            scaleX: movingItem.width / movingItem.naturalWidth,
                            scaleY: movingItem.height / movingItem.naturalHeight,
                            top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                            left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                        });
                        canvas.add(imtItem);
                        imtItem.setControlsVisibility({
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
                canvas.add(textItem);
                canvas.requestRenderAll();
            } else if (movingItem.parentNode.classList.contains('sidebarUnfoldShape')) {
                if (movingItem.classList.contains('rectShape')) {
                    const rectItem = new fabric.Rect({
                        top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                        left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                        height: 100,
                        width: 100,
                        fill: '#e89a4f',
                    });
                    canvas.add(rectItem);
                    canvas.requestRenderAll();
                } else if (movingItem.classList.contains('circleShape')) {
                    const circleItem = new fabric.Circle({
                        top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                        left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                        radius: 50,
                        fill: '#e89a4f',
                    });
                    canvas.add(circleItem);
                    canvas.requestRenderAll();
                } else if (movingItem.classList.contains('triangleShape')) {
                    const triangleItem = new fabric.Triangle({
                        top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                        left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                        width: 100,
                        height: 100,
                        fill: '#e89a4f',
                    });
                    canvas.add(triangleItem);
                    canvas.requestRenderAll();
                } else if (movingItem.classList.contains('abnormalShape')) {
                    fabric.loadSVGFromURL(src, (objects, options) => {
                        const abnormalShapeItem = fabric.util.groupSVGElements(objects, options);
                        abnormalShapeItem.set({
                            top: offsetY / currentSizeRatio - itemDragOffset.offsetY,
                            left: offsetX / currentSizeRatio - itemDragOffset.offsetX,
                            scaleX: 2.2,
                            scaleY: 2.2,
                            id: 'shape',
                        });
                        canvas.add(abnormalShapeItem);
                        canvas.requestRenderAll();
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
                    canvas.add(svgItem);
                    canvas.requestRenderAll();
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
                        canvas.add(stickerItem);
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
                canvas.requestRenderAll();
            }
        };
        // --- init when canvas is ready
        if (typeof canvas.on === 'function') {
            canvas.on('drop', dropItem);
        }
    }, [typeof canvas.on]);

    return (
        <div className='mainBoard'>
            <select className='ratioSelect' value={ratioSelectValue} onChange={handleRatioSelect}>
                {givenOptions}
                <option value='auto'>符合畫面大小</option>
            </select>
            <Sidebar
                canvas={canvas}
                setCanvas={setCanvas}
                currentSidebar={currentSidebar}
                setCurrentSidebar={setCurrentSidebar}
                setActiveObj={setActiveObj}
                activeObj={activeObj}
                trackOutSideClick={trackOutSideClick}
                saveDragItem={saveDragItem}
                canvasSetting={allSettings.canvasSetting}
                textSetting={textSetting}
            />
            <div className='drawingAreaBox'>
                <ComponentsSelection
                    canvas={canvas}
                    setCanvas={setCanvas}
                    hasUndo={hasUndo}
                    hasRedo={hasRedo}
                    setActiveObj={setActiveObj}
                    activeObj={activeObj}
                    currentSidebar={currentSidebar}
                    setCurrentSidebar={setCurrentSidebar}
                    trackOutSideClick={trackOutSideClick}
                    canvasSetting={allSettings.canvasSetting}
                />
                <DrawingArea
                    canvas={canvas}
                    setCanvas={setCanvas}
                    setActiveObj={setActiveObj}
                    activeObj={activeObj}
                    setHasUndo={setHasUndo}
                    setHasRedo={setHasRedo}
                    drawingAreaSettings={props.drawingAreaSettings}
                    ratioSelectValue={ratioSelectValue}
                    handleResponsiveSize={handleResponsiveSize}
                    zoomCanvas={zoomCanvas}
                />
            </div>
        </div>
    );
};

MainBoard.propTypes = {
    // TODO: 待資料確定後，明確定義 array 內容
    drawingAreaSettings: PropTypes.object.isRequired,
};

export default MainBoard;
