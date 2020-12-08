import React from 'react';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../../img/banner';

const Resize = (props) => {
    const allSettings = props.drawingAreaSettings;
    // size setting
    const [isChoosingCanvasSize, setIsChoosingCanvasSize] = React.useState(false);
    const canvasSizeOptions = [
        { name: '自訂尺寸', width: 0, height: 0 },
        { name: 'Instagram 貼文', width: 1080, height: 1080 },
        { name: '網頁常用', width: 1280, height: 1024 },
        { name: '橫式海報', width: 1728, height: 1296, mmW: 609, mmH: 457 },
        { name: '明信片', width: 560, height: 288, mmW: 198, mmH: 102 },
        { name: '橫式A4', width: 842, height: 595, mmW: 297, mmH: 210 },
        // { name: 'Facebook 封面', width: 2050, height: 780 },
        { name: '名片', width: 1063, height: 638, mmW: 90, mmH: 54 },
    ];
    const toggleSizeChoosing = (e, way) => {
        const targetContainer = e.currentTarget.parentNode;
        setIsChoosingCanvasSize(true);
        // if click outside, close selection
        const clickedOrNot = (e) => {
            if (!targetContainer.contains(e.target)) {
                document.removeEventListener('click', clickedOrNot, true);
                setIsChoosingCanvasSize(false);
            }
        };
        document.addEventListener('click', clickedOrNot, true);
    };
    const handleCanvasSize = (e, way) => {
        alert('請注意，若您修改為較小的畫布尺寸，超出範圍的元素將自動被裁切');
        // reset size on canvas and react state
        let newCanvasSetting = {};
        if (way === 'default') {
            const settings = canvasSizeOptions.find((option) => option.name === e.currentTarget.id);
            newCanvasSetting = {
                ...allSettings.canvasSetting,
                width: parseInt(settings.width),
                height: parseInt(settings.height),
            };
        } else {
            newCanvasSetting = {
                ...allSettings.canvasSetting,
                width: parseInt(customSize.width),
                height: parseInt(customSize.height),
            };
        }
        const container = document.querySelector('.canvas-container');
        allSettings.setCanvasSetting(newCanvasSetting);
        // resize to fix window
        let fixRatio = Math.min(
            (window.innerWidth * 0.72) / newCanvasSetting.width,
            (window.innerHeight * 0.72) / newCanvasSetting.height
        );
        container.style.width = `${fixRatio * newCanvasSetting.width}px`;
        container.style.height = `${fixRatio * newCanvasSetting.height}px`;
        allSettings.canvas.setZoom(fixRatio);
        allSettings.canvas.setWidth(newCanvasSetting.width * allSettings.canvas.getZoom());
        allSettings.canvas.setHeight(newCanvasSetting.height * allSettings.canvas.getZoom());
        // reset to auto fix
        allSettings.setRatioSelectValue('auto');
        // close toggle
        setIsChoosingCanvasSize(false);
        setIsTypingSize(false);
    };
    // custom size
    const [isTypingSize, setIsTypingSize] = React.useState(false);
    const [customSize, setCustomSize] = React.useState({ width: '', height: '' });
    const handleCustomWidth = (e) => {
        if (/^\d*$/.test(e.target.value)) {
            setCustomSize({ ...customSize, width: e.target.value });
        }
    };
    const handleCustomHeight = (e) => {
        if (/^\d*$/.test(e.target.value)) {
            setCustomSize({ ...customSize, height: e.target.value });
        }
    };
    const toggleCustomSizeInput = (e) => {
        setIsTypingSize(true);
        setIsChoosingCanvasSize(false);
    };

    // jsx: size choosing
    const sizeSelectionJsx = canvasSizeOptions.map((item, index) => {
        if (item.name !== '自訂尺寸') {
            return (
                <div
                    key={index}
                    id={item.name}
                    className='sizeOption'
                    onClick={(e) => handleCanvasSize(e, 'default')}
                >
                    {item.name}
                    <div className='sizeDetails'>
                        {item.mmW
                            ? `${item.mmW}×${item.mmH} mm`
                            : `${item.width}×${item.height} px`}
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    key={index}
                    id={item.name}
                    className='sizeOption'
                    onClick={toggleCustomSizeInput}
                >
                    {item.name}
                </div>
            );
        }
    });

    return (
        <div className='resizeIconWrapper'>
            <bannerIcons.Resize className='bannerIcons' onClick={toggleSizeChoosing} />
            {isChoosingCanvasSize ? <div className='sizeSelection'>{sizeSelectionJsx}</div> : null}
            {isTypingSize ? (
                <div className='customSizeWrapper' onMouseLeave={() => setIsTypingSize(false)}>
                    <div className='customSizeInputOuter'>
                        <input
                            placeholder='寬度'
                            value={customSize.width}
                            onChange={handleCustomWidth}
                        ></input>
                        <div className='customSizeInputCross'>×</div>
                        <input
                            placeholder='高度'
                            value={customSize.height}
                            onChange={handleCustomHeight}
                        ></input>
                        <div className='customSizeInputPx'>像素</div>
                    </div>
                    <div
                        className='customSizeButton'
                        onClick={(e) => {
                            if (customSize.width > 0 && customSize.height > 0) {
                                handleCanvasSize(e, 'custom');
                            }
                        }}
                    >
                        確認
                    </div>
                </div>
            ) : null}
        </div>
    );
};

Resize.propTypes = {
    // TODO: 待資料確定後，明確定義 array 內容
    drawingAreaSettings: PropTypes.object.isRequired,
};

export default Resize;
