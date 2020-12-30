import React from 'react';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../../img/banner';
import * as firebase from '../../../utils/firebase.js';
import { Alert, defaultAlertSetting } from '../../Alert';
import { trackOutSideClick } from '../../../utils/globalUtils.js';
import { canvasSizeOptions } from '../../../utils/globalConfig.js';
import * as utils from '../../../utils/globalUtils';

// all alert data
const resizeAlertSetting = {
    即將重設尺寸: {
        buttonNumber: 2,
        buttonOneTitle: '確認重設',
        buttonTwoTitle: '取消重設',
        title: '即將重設尺寸',
        content: '若您修改為較小的畫布尺寸，超出範圍的元素將自動被裁切',
    },
    設置錯誤: {
        buttonNumber: 1,

        buttonOneTitle: '關閉',
        buttonTwoTitle: '',
        title: '設置錯誤',
        content: '寬度或高度須介於 150 ~ 2000 之間',
    },
};
const limitSetting = (currentSize) => {
    return (
        currentSize.width < 150 ||
        currentSize.width > 2000 ||
        currentSize.height < 150 ||
        currentSize.height > 2000
    );
};

const Resize = (props) => {
    const customSizeRef = React.useRef(null);
    const [isTypingSize, setIsTypingSize] = React.useState(false);
    const [isChoosingCanvasSize, setIsChoosingCanvasSize] = React.useState(false);
    const [customSize, setCustomSize] = React.useState({ width: '', height: '' });
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertSetting, setAlertSetting] = React.useState({
        ...defaultAlertSetting,
    });
    const isOverLimit = limitSetting(customSize);
    // size setting
    const toggleSizeChoosing = (e) => {
        setIsChoosingCanvasSize(true);
        const targetContainer = e.currentTarget.parentNode;
        trackOutSideClick(targetContainer, () => setIsChoosingCanvasSize(false));
    };
    const handleCanvasSize = (target, way) => {
        // reset size on canvas and react state
        let newCanvasSetting = {};
        if (way === 'default') {
            const settings = canvasSizeOptions.find((option) => option.name === target.id);
            newCanvasSetting = {
                ...props.canvasSetting,
                width: parseInt(settings.width),
                height: parseInt(settings.height),
                type: settings.type,
            };
        } else {
            newCanvasSetting = {
                ...props.canvasSetting,
                width: parseInt(customSize.width),
                height: parseInt(customSize.height),
                type: 'custom',
            };
        }

        props.setCanvasSetting(newCanvasSetting);
        utils.setViewToFitWindow(newCanvasSetting);
        utils.initViewZoomIn(props.canvas, newCanvasSetting);
        // reset to auto fix
        props.setRatioSelectValue('auto');
        utils.presetBackgroundElements(props.canvas, newCanvasSetting);
        firebase.setBasicSetting(
            props.fileId,
            newCanvasSetting.width,
            newCanvasSetting.height,
            newCanvasSetting.type,
            props.canvas
        );
    };
    // custom size
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
    const toggleCustomSizeInput = async (e) => {
        setIsChoosingCanvasSize(false);
        await setIsTypingSize(true);
        const targetContainer = customSizeRef.current;
        trackOutSideClick(targetContainer, () => setIsTypingSize(false));
    };

    // jsx: size choosing
    const sizeSelectionJsx = canvasSizeOptions.map((item, index) =>
        item.name !== '自訂尺寸' ? (
            <div
                key={index}
                id={item.name}
                className='sizeOption'
                onClick={(e) => {
                    const target = e.currentTarget;
                    setAlertSetting({
                        ...resizeAlertSetting['即將重設尺寸'],
                        buttonOneFunction: () => {
                            setShowAlert(false);
                            handleCanvasSize(target, 'default');
                        },
                        buttonTwoFunction: () => {
                            setShowAlert(false);
                            return;
                        },
                    });
                    // close toggle
                    setIsChoosingCanvasSize(false);
                    setIsTypingSize(false);
                    setShowAlert(true);
                }}
            >
                {item.name}
                <div className='sizeDetails'>
                    {item.mmW ? `${item.mmW}×${item.mmH} mm` : `${item.width}×${item.height} px`}
                </div>
            </div>
        ) : (
            <div key={index} id={item.name} className='sizeOption' onClick={toggleCustomSizeInput}>
                {item.name}
            </div>
        )
    );

    return (
        <div className='resizeIconWrapper'>
            {showAlert && (
                <Alert
                    buttonNumber={alertSetting.buttonNumber}
                    buttonOneFunction={alertSetting.buttonOneFunction}
                    buttonTwoFunction={alertSetting.buttonTwoFunction}
                    buttonOneTitle={alertSetting.buttonOneTitle}
                    buttonTwoTitle={alertSetting.buttonTwoTitle}
                    title={alertSetting.title}
                    content={alertSetting.content}
                />
            )}
            <bannerIcons.Resize className='bannerIcons' onClick={toggleSizeChoosing} />
            {isChoosingCanvasSize && <div className='sizeSelection'>{sizeSelectionJsx}</div>}
            {isTypingSize && (
                <div className='customSizeWrapper' ref={customSizeRef}>
                    <div className='customSizeInputOuter'>
                        <input
                            maxLength='4'
                            placeholder='寬度'
                            value={customSize.width}
                            onChange={handleCustomWidth}
                            onFocus={() => {
                                props.setIsFocusInput(true);
                            }}
                            onBlur={() => {
                                props.setIsFocusInput(false);
                            }}
                        ></input>
                        <div className='customSizeInputCross'>×</div>
                        <input
                            maxLength='4'
                            placeholder='高度'
                            value={customSize.height}
                            onChange={handleCustomHeight}
                            onFocus={() => {
                                props.setIsFocusInput(true);
                            }}
                            onBlur={() => {
                                props.setIsFocusInput(false);
                            }}
                        ></input>
                        <div className='customSizeInputPx'>像素</div>
                    </div>
                    <div
                        className='customSizeButton'
                        onClick={(e) => {
                            if (isOverLimit) {
                                setAlertSetting({
                                    ...resizeAlertSetting['設置錯誤'],
                                    buttonOneFunction: () => {
                                        setShowAlert(false);
                                    },
                                    buttonTwoFunction: () => {},
                                });
                                setShowAlert(true);
                            } else {
                                const target = e.currentTarget;
                                setAlertSetting({
                                    ...resizeAlertSetting['即將重設尺寸'],
                                    buttonOneFunction: () => {
                                        setShowAlert(false);
                                        handleCanvasSize(target, 'custom');
                                    },
                                    buttonTwoFunction: () => {
                                        setShowAlert(false);
                                        return;
                                    },
                                });
                                setIsChoosingCanvasSize(false);
                                setIsTypingSize(false);
                                setShowAlert(true);
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
    fileId: PropTypes.string.isRequired,
    setIsFocusInput: PropTypes.func.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    setCanvasSetting: PropTypes.func.isRequired,
    canvas: PropTypes.object.isRequired,
    setRatioSelectValue: PropTypes.func.isRequired,
};

export default React.memo(Resize);
