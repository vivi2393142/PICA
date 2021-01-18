import { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import 'fabric-history';
import { ChromePicker } from 'react-color';
import toggleRight from '../../../../img/src/arrowRight.svg';
import { trackOutSideClick } from '../../../../utils/globalUtils.js';
import * as config from '../../../../utils/globalConfig.js';

const NavLeftColor = (props) => {
    const componentsNavLeftRef = useRef(null);
    const [widthSetting, setWidthSetting] = useState('14rem');

    useEffect(() => {
        window.innerWidth > config.mediaQuerySize.medium ? setWidthSetting('14rem') : setWidthSetting('100%');
    }, []);
    useEffect(() => {
        const handleResize = () => {
            window.innerWidth > config.mediaQuerySize.medium
                ? setWidthSetting('14rem')
                : setWidthSetting('100%');
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // unfold nav
    const [isChoosingColor, setIsChoosingColor] = useState(false);
    const toggleColorSelection = (e) => {
        setIsChoosingColor(true);
        props.setIsFocusInput(true);
        if (componentsNavLeftRef.current.style) {
            componentsNavLeftRef.current.style.zIndex = '2';
            trackOutSideClick(e.currentTarget.parentNode, () => {
                setIsChoosingColor(false);
                props.setIsFocusInput(false);
                componentsNavLeftRef.current.style.zIndex = '1';
                props.canvas.fire('object:modified');
            });
        }
    };
    // -- color state
    const [colorChosen, setColorChosen] = useState({
        background: {
            r: '0',
            g: '0',
            b: '0',
            a: '1',
        },
    });
    const handleColorChange = (color) => {
        const colorRgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
        setColorChosen({ background: colorRgba });
        props.activeObj.set('fill', colorRgba);
        props.canvas.requestRenderAll();
    };

    useEffect(() => {
        const currentType = props.activeObj.type;
        if (
            currentType === 'rect' ||
            currentType === 'circle' ||
            currentType === 'triangle' ||
            currentType === 'i-text' ||
            currentType === 'path' ||
            currentType === 'polygon'
        ) {
            setColorChosen({ background: props.activeObj.fill });
        }
    }, [props.activeObj]);

    return (
        <div className='colorChoosingBox'>
            <div
                ref={componentsNavLeftRef}
                className='currentColor'
                style={{ backgroundColor: colorChosen.background }}
                onClick={toggleColorSelection}
            ></div>
            {isChoosingColor && (
                <ChromePicker
                    color={colorChosen.background}
                    onChange={handleColorChange}
                    className='originalColorPicker'
                    width={widthSetting}
                />
            )}
            {isChoosingColor && (
                <div
                    className='mobileSubmit'
                    onClick={() => {
                        setIsChoosingColor(false);
                        componentsNavLeftRef.current.style.zIndex = '1';
                        props.setIsFocusInput(false);
                        props.canvas.fire('object:modified');
                    }}
                >
                    <img src={toggleRight}></img>
                </div>
            )}
        </div>
    );
};

NavLeftColor.propTypes = {
    canvas: PropTypes.object.isRequired,
    activeObj: PropTypes.object.isRequired,
    setIsFocusInput: PropTypes.func,
};

export default memo(NavLeftColor);
