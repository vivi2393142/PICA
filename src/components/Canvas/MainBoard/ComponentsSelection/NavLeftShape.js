import { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import 'fabric-history';
import { ChromePicker } from 'react-color';
import { trackOutSideClick } from '../../../../utils/globalUtils.js';

const stokeWidthArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const NavLeftShape = (props) => {
    // color setting function
    const [isChoosingBorderColor, setIsChoosingBorderColor] = useState(false);
    const toggleBorderColorSelection = (e) => {
        setIsChoosingBorderColor(true);
        props.setIsFocusInput(true);
        trackOutSideClick(e.currentTarget.parentNode, () => {
            setIsChoosingBorderColor(false);
            props.setIsFocusInput(false);
            props.canvas.fire('object:modified');
        });
    };
    // -- color state
    const [borderColorChosen, setBorderColorChosen] = useState({
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
    useEffect(() => {
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
    const [rectStroke, setRectStroke] = useState(
        props.activeObj.strokeWidth ? props.activeObj.strokeWidth : 0
    );
    const handleRectStoke = (e) => {
        setRectStroke(parseInt(e.target.value));
        props.activeObj.set({
            strokeWidth: parseInt(e.target.value),
        });
        props.canvas.fire('object:modified');
        props.canvas.requestRenderAll();
    };

    const stokeWidthOptionsJsx = stokeWidthArray.map((width) => <option key={width}>{width}</option>);

    return (
        <div className='specificNav'>
            <div className='colorChoosingBox borderChoosing'>
                <div
                    className='currentColor currentBorderColor'
                    style={{ borderColor: borderColorChosen.background }}
                    onClick={toggleBorderColorSelection}
                ></div>
                {isChoosingBorderColor && (
                    <ChromePicker color={borderColorChosen.background} onChange={handleBorderColorChange} />
                )}
            </div>
            <div className='specificButton textSizeOuter borderWidth'>
                <select className='textSizeSelect' value={rectStroke} onChange={handleRectStoke}>
                    {stokeWidthOptionsJsx}
                </select>
            </div>
        </div>
    );
};

NavLeftShape.propTypes = {
    canvas: PropTypes.object.isRequired,
    activeObj: PropTypes.object.isRequired,
    setIsFocusInput: PropTypes.func,
};

export default memo(NavLeftShape);
