import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../../img/banner';
import * as exportUtils from '../../../utils/export';
import { trackOutSideClick } from '../../../utils/globalUtils.js';

const Export = (props) => {
    const [isChoosingExport, setIsChoosingExport] = useState(false);
    const toggleExport = (e) => {
        setIsChoosingExport(true);
        const targetContainer = e.currentTarget.parentNode;
        trackOutSideClick(targetContainer, () => setIsChoosingExport(false));
    };

    // set export function
    const exportCanvas = document.getElementById('fabric-canvas');
    const handleExport = (way) => {
        let dataURL = '';
        const fileName = props.canvasSetting.title ? props.canvasSetting.title : '未命名畫布';
        const width = props.canvas.width;
        const height = props.canvas.height;
        const zoomRatio = width / height;
        switch (way) {
            case 'pdf':
                exportUtils.downloadPdf(width, height, exportCanvas, fileName);
                setIsChoosingExport(false);
                return;
            case 'jpg':
                dataURL = exportUtils.downloadJpg(props.canvas, zoomRatio);
                break;
            case 'png':
                dataURL = exportUtils.downloadPng(props.canvas, zoomRatio);
                break;
        }
        const dlLink = document.createElement('a');
        dlLink.download = fileName;
        dlLink.href = dataURL;
        dlLink.click();
        setIsChoosingExport(false);
    };

    return (
        <div className='exportIconWrapper'>
            <bannerIcons.Download className='bannerIcons' onClick={toggleExport} />
            {isChoosingExport && (
                <div className='exportWrapper'>
                    <div onClick={() => handleExport('jpg')}>下載 JPG</div>
                    <div onClick={() => handleExport('png')}>下載 PNG</div>
                    <div onClick={() => handleExport('pdf')}>下載為 PDF</div>
                </div>
            )}
        </div>
    );
};

Export.propTypes = {
    canvasSetting: PropTypes.object.isRequired,
    canvas: PropTypes.object.isRequired,
};

export default memo(Export);
