import React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';
import * as utils from '../../../../utils/globalUtils.js';
import * as config from '../../../../utils/globalConfig';

const defaultBackgroundInString = 'rgba(255, 255, 255, 1)';
const backImgHeightForWaterfall = { normal: '10rem', mobile: '100%' };
const defaultBackground = {
    r: '255',
    g: '255',
    b: '255',
    a: '1',
};

const Background = (props) => {
    const chromePickerRef = React.useRef(null);
    const [isChoosingBackColor, setIsChoosingBackColor] = React.useState(false);
    const [backColorChosen, setBackColorChosen] = React.useState({
        background: {
            ...defaultBackground,
        },
    });

    // preset background
    React.useEffect(() => {
        props.canvas.backgroundColor && setBackColorChosen({ background: props.canvas.backgroundColor });
    }, [props.canvas.backgroundColor]);

    const toggleBackColorSelection = async (e) => {
        await setIsChoosingBackColor(true);
        props.setIsFocusInput(true);
        utils.trackOutSideClick(chromePickerRef.current, () => {
            setIsChoosingBackColor(false);
            props.setIsFocusInput(false);
            props.canvas.fire('object:modified');
        });
    };
    const backgroundColorHandler = (color) => {
        props.canvas.backgroundImage = 0;
        props.canvas.backgroundColor = color;
    };
    const handleBackColorChange = (color) => {
        const colorRgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
        setBackColorChosen({ background: colorRgba });
        backgroundColorHandler(colorRgba);
    };
    const handleBackColorChangeCube = (e) => {
        const color = e.target.style.backgroundColor
            ? e.target.style.backgroundColor
            : defaultBackgroundInString;
        setBackColorChosen({ background: color });
        backgroundColorHandler(color);
        props.canvas.fire('object:modified');
        props.canvas.requestRenderAll();
    };
    const backgroundImageHandler = (e) => {
        props.canvas.offHistory();
        const allObjects = props.canvas.getObjects();
        if (allObjects.length) {
            allObjects[0].specialType === 'background' && props.canvas.remove(allObjects[0]);
        }
        const scaleToWidth = props.canvasSetting.width / e.target.naturalWidth;
        const scaleToHeight = props.canvasSetting.height / e.target.naturalHeight;
        const scaleWay = scaleToWidth > scaleToHeight ? 'toWidth' : 'toHeight';
        props.canvas.onHistory();
        fabric.Image.fromURL(
            e.target.src,
            (img) => {
                const backImg = img.set({
                    scaleX: scaleWay === 'toWidth' ? scaleToWidth : scaleToHeight,
                    scaleY: scaleWay === 'toWidth' ? scaleToWidth : scaleToHeight,
                });
                utils.presetBackgroundImg(backImg, props.canvas, scaleWay, scaleToWidth, scaleToHeight);
            },
            {
                crossOrigin: 'anonymous',
            }
        );
    };
    // background color cube
    const backgroundColorJsx = config.backgroundColorArray.map((item, index) => (
        <div
            key={index}
            className='backgroundColorCube'
            style={{ backgroundColor: item }}
            onClick={handleBackColorChangeCube}
        ></div>
    ));
    // background image
    const backgroundImageJsx = config.backgroundImageArray.map((item, index) => (
        <div key={index} className='unfoldItemGalleryWrapper'>
            <img
                key={index}
                draggable='false'
                onClick={backgroundImageHandler}
                className='unfoldItem unfoldItemGallery'
                style={{
                    position: 'relative',
                    height: props.isAtMobile
                        ? backImgHeightForWaterfall.mobile
                        : backImgHeightForWaterfall.normal,
                }}
                src={item}
                onLoad={(e) => {
                    e.target.parentNode.style.width =
                        e.target.naturalHeight > e.target.naturalWidth
                            ? config.imageWidthForWaterfall.narrow
                            : config.imageWidthForWaterfall.wide;
                }}
            ></img>
        </div>
    ));

    return (
        <div
            className='sidebarUnfoldInner sidebarUnfoldBack'
            style={{ display: props.currentSidebar === 'background' ? 'flex' : 'none' }}
        >
            {isChoosingBackColor && (
                <div ref={chromePickerRef}>
                    <ChromePicker
                        className='backgroundPicker'
                        color={backColorChosen.background}
                        onChange={(color) => {
                            handleBackColorChange(color);
                            props.canvas.requestRenderAll();
                        }}
                    />
                </div>
            )}
            <div className='unfoldImgWrapper '>
                <div className='toggleSubtitle'>背景色彩</div>
                <div className='currentBackground'>
                    <div
                        className={`backgroundColorCube currentColorCube ${
                            backColorChosen.background === defaultBackgroundInString ||
                            JSON.stringify(backColorChosen.background) === JSON.stringify(defaultBackground)
                                ? 'nonColor'
                                : ''
                        }`}
                        style={{ backgroundColor: backColorChosen.background }}
                        onClick={toggleBackColorSelection}
                    ></div>
                </div>
                <div className='backgroundColorChart'>
                    <div className='backgroundColorCube nonColor' onClick={handleBackColorChangeCube}></div>
                    {backgroundColorJsx}
                </div>
            </div>
            <div className='unfoldImgWrapper' style={{ overflow: 'visible' }}>
                <div className='toggleSubtitle'>背景圖片</div>
                <div className='backImgChart'>{backgroundImageJsx}</div>
            </div>
        </div>
    );
};

Background.propTypes = {
    canvas: PropTypes.object.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    currentSidebar: PropTypes.string.isRequired,
    setIsFocusInput: PropTypes.func.isRequired,
    isAtMobile: PropTypes.bool.isRequired,
};

export default React.memo(Background);
