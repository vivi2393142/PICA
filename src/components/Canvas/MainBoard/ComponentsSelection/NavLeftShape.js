import React from 'react';
import PropTypes from 'prop-types';
import 'fabric-history';
import { ChromePicker } from 'react-color';

const NavLeftShape = (props) => {
    // color setting function
    const [isChoosingBorderColor, setIsChoosingBorderColor] = React.useState(false);
    const toggleBorderColorSelection = (e) => {
        setIsChoosingBorderColor(true);
        props.trackOutSideClick(e.currentTarget, () => {
            setIsChoosingBorderColor(false);
            props.canvas.fire('object:modified');
        });
    };
    // -- color state
    const [borderColorChosen, setBorderColorChosen] = React.useState({
        background: {
            r: '0',
            g: '0',
            b: '0',
            a: '1',
        },
    });
    const handleBorderColorChange = (color) => {
        const colorRgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
        setBorderColorChosen({ background: colorRgba });
        props.activeObj.set('stroke', colorRgba);
        props.canvas.requestRenderAll();
    };
    // -- preset active object value on specific selection
    React.useEffect(() => {
        if (
            props.activeObj.type === 'rect' ||
            props.activeObj.type === 'circle' ||
            props.activeObj.type === 'triangle'
        ) {
            if (props.activeObj.stroke) {
                setBorderColorChosen({ background: props.activeObj.stroke });
            }
        }
    }, [props.activeObj]);
    // set stroke width
    const [rectStroke, setRectStroke] = React.useState(1);
    const handleRectStoke = (e) => {
        setRectStroke(parseInt(e.target.value));
        props.activeObj.set({
            strokeWidth: parseInt(e.target.value),
        });
        props.canvas.requestRenderAll();
        props.canvas.fire('object:modified');
    };
    const stokeWidthArray = [0, 1, 2, 3, 4, 5];
    const stokeWidthOptions = stokeWidthArray.map((width, index) => (
        <option key={index}>{width}</option>
    ));
    // render
    return (
        <div className='specificNav'>
            <div className='colorChoosingBox borderChoosing'>
                <div
                    className='currentColor currentBorderColor'
                    style={{ borderColor: borderColorChosen.background }}
                    onClick={toggleBorderColorSelection}
                ></div>
                {isChoosingBorderColor && (
                    <ChromePicker
                        color={borderColorChosen.background}
                        onChange={handleBorderColorChange}
                    />
                )}
            </div>
            <div className='specificButton textSizeOuter borderWidth'>
                <select className='textSizeSelect' value={rectStroke} onChange={handleRectStoke}>
                    {stokeWidthOptions}
                </select>
                {/* <input
                    className='textSizeInput'
                    value={rectStroke}
                    onChange={handleRectStoke}
                ></input> */}
            </div>
        </div>
    );
};

NavLeftShape.propTypes = {
    trackOutSideClick: PropTypes.func.isRequired,
    canvas: PropTypes.object.isRequired,
    activeObj: PropTypes.object.isRequired,
};

export default NavLeftShape;
