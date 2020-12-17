import React from 'react';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../../img/banner';
import * as firebase from '../../../firebase';

const Resize = (props) => {
    const allSettings = props.drawingAreaSettings;
    // size setting
    const [isChoosingCanvasSize, setIsChoosingCanvasSize] = React.useState(false);
    const canvasSizeOptions = [
        { name: '自訂尺寸', type: 'custom', width: 1800, height: 1600 },
        { name: '橫式海報', type: 'poster', width: 1728, height: 1296, mmW: 609, mmH: 457 },
        { name: '網頁', type: 'web', width: 1280, height: 1024 },
        { name: 'Instagram', type: 'instagram', width: 1080, height: 1080 },
        { name: '橫式A4', type: 'a4', width: 842, height: 595, mmW: 297, mmH: 210 },
        { name: '明信片', type: 'postCard', width: 560, height: 288, mmW: 198, mmH: 102 },
        { name: '名片', type: 'nameCard', width: 255, height: 153, mmW: 90, mmH: 54 },
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
                type: settings.type,
            };
        } else {
            newCanvasSetting = {
                ...allSettings.canvasSetting,
                width: parseInt(customSize.width),
                height: parseInt(customSize.height),
                type: 'custom',
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
        // preset background image object style
        let backgroundObject = allSettings.canvas
            .getObjects('image')
            .find((x) => x.specialType === 'background');
        if (backgroundObject) {
            allSettings.canvas.remove(backgroundObject);
            const scaleToWidth = newCanvasSetting.width / backgroundObject.width;
            const scaleToHeight = newCanvasSetting.height / backgroundObject.height;
            const scaleWay = scaleToWidth > scaleToHeight ? 'toWidth' : 'toHeight';
            allSettings.presetBackgroundImg(
                backgroundObject,
                allSettings.canvas,
                newCanvasSetting,
                scaleWay,
                scaleToWidth,
                scaleToHeight
            );
        }
        firebase.setBasicSetting(
            props.fileId,
            newCanvasSetting.width,
            newCanvasSetting.height,
            newCanvasSetting.type,
            allSettings.canvas
        );
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
            {isChoosingCanvasSize && <div className='sizeSelection'>{sizeSelectionJsx}</div>}
            {isTypingSize && (
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
            )}
        </div>
    );
};

Resize.propTypes = {
    // TODO: 待資料確定後，明確定義 array 內容
    drawingAreaSettings: PropTypes.object.isRequired,
    fileId: PropTypes.string.isRequired,
};

export default Resize;
