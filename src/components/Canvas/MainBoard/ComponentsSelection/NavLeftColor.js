import React from 'react';
import PropTypes from 'prop-types';
import 'fabric-history';
import { ChromePicker } from 'react-color';
import toggleRight from '../../../../img/src/arrowRight.svg';

const NavLeftColor = (props) => {
    const [widthSetting, setWidthSetting] = React.useState('14rem');

    React.useEffect(() => {
        window.innerWidth > 600 ? setWidthSetting('14rem') : setWidthSetting('100%');
    }, []);
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 600) {
                setWidthSetting('14rem');
            } else {
                setWidthSetting('100%');
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // unfold nav
    const [isChoosingColor, setIsChoosingColor] = React.useState(false);
    const toggleColorSelection = (e) => {
        setIsChoosingColor(true);
        props.setIsFocusInput(true);
        document.querySelector('.componentsNavLeft').style.zIndex = '2';
        props.trackOutSideClick(e.currentTarget, () => {
            setIsChoosingColor(false);
            props.setIsFocusInput(false);
            document.querySelector('.componentsNavLeft').style.zIndex = '1';
            props.canvas.fire('object:modified');
        });
    };
    // -- color state
    const [colorChosen, setColorChosen] = React.useState({
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

    React.useEffect(() => {
        if (
            props.activeObj.type === 'rect' ||
            props.activeObj.type === 'circle' ||
            props.activeObj.type === 'triangle' ||
            props.activeObj.type === 'i-text' ||
            props.activeObj.type === 'path' ||
            props.activeObj.type === 'polygon'
        ) {
            setColorChosen({ background: props.activeObj.fill });
        }
    }, [props.activeObj]);
    // render
    return (
        <div className='colorChoosingBox'>
            <div
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
                        document.querySelector('.componentsNavLeft').style.zIndex = '1';
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
    trackOutSideClick: PropTypes.func.isRequired,
    setIsFocusInput: PropTypes.func,
};

export default NavLeftColor;
