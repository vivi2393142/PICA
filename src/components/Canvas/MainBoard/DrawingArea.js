import React from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import 'fabric-history';
import * as utils from '../../../utils/globalUtils';

const DrawingArea = (props) => {
    // -- listen to resize then set
    React.useEffect(() => {
        if (Object.keys(props.canvasSetting).length && props.ratioSelectValue === 'auto') {
            const resetViewToFitWindow = () => {
                utils.setViewToFitWindow(props.canvasSetting);
            };
            window.addEventListener('resize', resetViewToFitWindow);
            return () => {
                window.removeEventListener('resize', resetViewToFitWindow);
            };
        }
    }, [props.ratioSelectValue, props.canvasSetting]);

    return (
        <div className={`canvasWrapper ${props.isMobileZoomIn ? 'mobileZoomIn' : ''}`}>
            <canvas className='drawingArea' id='fabric-canvas' />
        </div>
    );
};

DrawingArea.propTypes = {
    canvasSetting: PropTypes.object.isRequired,
    ratioSelectValue: PropTypes.string.isRequired,
    isMobileZoomIn: PropTypes.bool.isRequired,
};

export default React.memo(DrawingArea);
