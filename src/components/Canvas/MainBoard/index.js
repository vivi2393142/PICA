import React from 'react';
import PropTypes from 'prop-types';
import DrawingArea from './DrawingArea';
import Sidebar from './Sidebar';
import ComponentsSelection from './ComponentsSelection/index';

const MainBoard = (props) => {
    const allSettings = props.drawingAreaSettings;
    const canvas = allSettings.canvas;
    const setCanvas = allSettings.setCanvas;

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
    const handleRatioSelect = (e) => {
        allSettings.setRatioSelectValue(e.target.value);
        const container = document.querySelector('.canvas-container');
        if (e.target.value === 'auto') {
            allSettings.handleResponsiveSize(container);
        } else {
            container.style.width = `${
                (parseInt(e.target.value) / 100) * allSettings.canvasSetting.width
            }px`;
            container.style.height = `${
                (parseInt(e.target.value) / 100) * allSettings.canvasSetting.height
            }px`;
        }
        // -- zoom canvas without quality lose
        // zoomCanvas(canvas);
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

    return (
        <div className='mainBoard'>
            <select
                className='ratioSelect'
                value={allSettings.ratioSelectValue}
                onChange={handleRatioSelect}
            >
                {givenOptions}
                <option value='auto'>符合畫面大小</option>
            </select>
            <Sidebar
                canvas={canvas}
                setCanvas={setCanvas}
                currentSidebar={currentSidebar}
                setCurrentSidebar={setCurrentSidebar}
                setActiveObj={allSettings.setActiveObj}
                activeObj={allSettings.activeObj}
                trackOutSideClick={trackOutSideClick}
                saveDragItem={allSettings.saveDragItem}
                canvasSetting={allSettings.canvasSetting}
                textSetting={textSetting}
            />
            <div className='drawingAreaBox'>
                <ComponentsSelection
                    canvas={canvas}
                    setCanvas={setCanvas}
                    hasUndo={allSettings.hasUndo}
                    hasRedo={allSettings.hasRedo}
                    setActiveObj={allSettings.setActiveObj}
                    activeObj={allSettings.activeObj}
                    currentSidebar={currentSidebar}
                    setCurrentSidebar={setCurrentSidebar}
                    trackOutSideClick={trackOutSideClick}
                    canvasSetting={allSettings.canvasSetting}
                />
                <DrawingArea
                    canvas={canvas}
                    setCanvas={setCanvas}
                    setActiveObj={allSettings.setActiveObj}
                    activeObj={allSettings.activeObj}
                    setHasUndo={allSettings.setHasUndo}
                    setHasRedo={allSettings.setHasRedo}
                    drawingAreaSettings={props.drawingAreaSettings}
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
