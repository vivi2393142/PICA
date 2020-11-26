import React from 'react';
import PropTypes from 'prop-types';
import DrawingArea from './DrawingArea';

const MainBoard = (props) => {
    const allSettings = props.drawingAreaSettings;
    const [ratioSelectValue, setRatioSelectValue] = React.useState('auto');

    const handleResponsiveSize = (container) => {
        let fixRatio = Math.min(
            (window.innerWidth * 0.75) / allSettings.canvasSetting.width,
            (window.innerHeight * 0.75) / allSettings.canvasSetting.height
        );
        container.style.width = `${fixRatio * allSettings.canvasSetting.width}px`;
        container.style.height = `${fixRatio * allSettings.canvasSetting.height}px`;
    };

    const handleRatioSelect = (e) => {
        setRatioSelectValue(e.target.value);
        console.log(ratioSelectValue);
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
            <DrawingArea
                drawingAreaSettings={props.drawingAreaSettings}
                ratioSelectValue={ratioSelectValue}
                handleResponsiveSize={handleResponsiveSize}
            />
        </div>
    );
};

MainBoard.propTypes = {
    // TODO: 待資料確定後，明確定義 array 內容
    drawingAreaSettings: PropTypes.object.isRequired,
};

export default MainBoard;
