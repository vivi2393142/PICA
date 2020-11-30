import React from 'react';
import PropTypes from 'prop-types';
import 'fabric-history';
import { ChromePicker } from 'react-color';
import * as icons from '../../../icons.js';

const NavLeftColor = (props) => {
    // unfold nav
    const [isChoosingColor, setIsChoosingColor] = React.useState(false);
    const toggleColorSelection = (e) => {
        setIsChoosingColor(true);
        props.trackOutSideClick(e.currentTarget, () => {
            setIsChoosingColor(false);
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
            props.activeObj.type === 'i-text'
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
            {isChoosingColor ? (
                <ChromePicker color={colorChosen.background} onChange={handleColorChange} />
            ) : null}
        </div>
    );
};

NavLeftColor.propTypes = {
    canvas: PropTypes.object.isRequired,
    activeObj: PropTypes.object.isRequired,
    trackOutSideClick: PropTypes.func.isRequired,
};

export default NavLeftColor;
