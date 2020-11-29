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
            <select className='ratioSelect' value={ratioSelectValue} onChange={handleRatioSelect}>
                {givenOptions}
                <option value='auto'>符合畫面大小</option>
            </select>
            <Sidebar canvas={canvas} setCanvas={setCanvas} />
            <div className='drawingAreaBox'>
                <ComponentsSelection
                    canvas={canvas}
                    setCanvas={setCanvas}
                    hasUndo={hasUndo}
                    hasRedo={hasRedo}
                    setActiveObj={setActiveObj}
                    activeObj={activeObj}
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
