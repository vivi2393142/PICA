import React from 'react';
import PropTypes from 'prop-types';
import 'fabric-history';
import { ChromePicker } from 'react-color';

const NavLeftColor = (props) => {
    // unfold nav
    const [isChoosingColor, setIsChoosingColor] = React.useState(false);
    const toggleColorSelection = (e) => {
        setIsChoosingColor(true);
        props.setIsFocusInput(true);
        props.trackOutSideClick(e.currentTarget, () => {
            setIsChoosingColor(false);
            props.setIsFocusInput(false);
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
    // -- preset active object value on specific selection
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
                <ChromePicker color={colorChosen.background} onChange={handleColorChange} />
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
