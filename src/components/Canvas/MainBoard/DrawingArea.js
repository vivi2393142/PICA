import React from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import 'fabric-history';

const DrawingArea = (props) => {
    const allSettings = props.drawingAreaSettings;

    // -- handle auto resizing option
    React.useEffect(() => {
        const handleResize = () => {
            const container = document.querySelector('.canvas-container');
            if (allSettings.ratioSelectValue === 'auto') {
                allSettings.handleResponsiveSize(container);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [allSettings.ratioSelectValue]);

    //render
    return (
        <div className='canvasWrapper'>
            <canvas className='drawingArea' id='fabric-canvas' />
        </div>
    );
};

DrawingArea.propTypes = {
    // TODO: 待資料確定後，明確定義 array 內容
    drawingAreaSettings: PropTypes.object.isRequired,
    canvas: PropTypes.object.isRequired,
    setCanvas: PropTypes.func.isRequired,
    setActiveObj: PropTypes.func.isRequired,
    activeObj: PropTypes.object.isRequired,
    setHasUndo: PropTypes.func.isRequired,
    setHasRedo: PropTypes.func.isRequired,
    zoomCanvas: PropTypes.func.isRequired,
};

export default DrawingArea;
