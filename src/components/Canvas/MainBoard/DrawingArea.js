import React from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import 'fabric-history';

const DrawingArea = (props) => {
    const allSettings = props.allSettings;

    // -- handle auto resizing option
    React.useEffect(() => {
        if (Object.keys(allSettings.canvasSetting).length !== 0) {
            const handleResize = () => {
                const container = document.querySelector('.canvas-container');
                if (allSettings.ratioSelectValue === 'auto') {
                    allSettings.handleResponsiveSize(container, allSettings.canvasSetting);
                }
            };
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [allSettings.ratioSelectValue, allSettings.canvasSetting]);

    //render
    return (
        <div className='canvasWrapper'>
            <canvas className='drawingArea' id='fabric-canvas' />
        </div>
    );
};

DrawingArea.propTypes = {
    // TODO: 待資料確定後，明確定義 array 內容
    allSettings: PropTypes.object.isRequired,
    zoomCanvas: PropTypes.func.isRequired,
};

export default DrawingArea;
