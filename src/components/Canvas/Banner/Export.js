import React from 'react';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../../img/banner';
import jsPDF from 'jspdf';

const Export = (props) => {
    // check if is choosing export
    const [isChoosingExport, setIsChoosingExport] = React.useState(false);
    const toggleExport = (e) => {
        const targetContainer = e.currentTarget.parentNode;
        setIsChoosingExport(true);
        // if click outside, close selection
        const clickedOrNot = (e) => {
            if (!targetContainer.contains(e.target)) {
                document.removeEventListener('click', clickedOrNot, true);
                setIsChoosingExport(false);
            }
        };
        document.addEventListener('click', clickedOrNot, true);
    };

    // set export function
    const allSettings = props.drawingAreaSettings;
    const exportCanvas = document.getElementById('fabric-canvas');
    const handleExport = (way) => {
        let dataURL = '';
        const fileName = allSettings.canvasSetting.title
            ? allSettings.canvasSetting.title
            : '未命名畫布';
        const zoomRatio = allSettings.canvasSetting.width / allSettings.canvas.width;
        if (way === 'pdf') {
            let width = allSettings.canvas.width;
            let height = allSettings.canvas.height;
            let pdf;
            if (width > height) {
                pdf = new jsPDF('l', 'px', [width, height]);
            } else {
                pdf = new jsPDF('p', 'px', [height, width]);
            }
            width = pdf.internal.pageSize.getWidth();
            height = pdf.internal.pageSize.getHeight();
            pdf.addImage(exportCanvas, 'PNG', 0, 0, width, height);
            pdf.save(`${fileName}.pdf`);
            setIsChoosingExport(false);
            return;
        } else if (way === 'jpg') {
            console.log('下載jpg');
            dataURL = allSettings.canvas.toDataURL({
                format: 'jpeg',
                quality: 1,
                multiplier: zoomRatio,
            });
            // console.log(dataURL);
        } else if (way === 'png') {
            dataURL = allSettings.canvas.toDataURL({
                format: 'png',
                multiplier: zoomRatio,
            });
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
    // TODO: 待資料確定後，明確定義 array 內容
    drawingAreaSettings: PropTypes.object.isRequired,
};

export default Export;
