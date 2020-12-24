import React from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../../../img/icons';
import NavLeftColor from './NavLeftColor';
import 'fontfaceobserver';

const NavLeftText = (props) => {
    // unfold nav
    const [isChoosingSpace, setIsChoosingSpace] = React.useState(false);
    const [isChoosingSize, setIsChoosingSize] = React.useState(false);
    const toggleSpaceSelection = (e) => {
        setIsChoosingSpace(true);
        props.trackOutSideClick(e.currentTarget, () => {
            setIsChoosingSpace(false);
            props.canvas.fire('object:modified');
        });
    };
    const toggleSizeSelection = (e) => {
        setIsChoosingSize(true);
        props.trackOutSideClick(e.currentTarget, () => {
            setIsChoosingSize(false);
            props.canvas.fire('object:modified');
        });
    };
    // -- text state
    const [textFont, setTextFont] = React.useState('Sans-serif');
    const handleTextFont = (e) => {
        setTextFont(e.target.value);
        if (e.target.value === 'Sans-serif') {
            props.activeObj.set({
                fontFamily: e.target.value,
            });
            props.canvas.fire('object:modified');
            props.canvas.requestRenderAll();
        } else {
            props.activeObj.set({
                fontFamily: e.target.value,
            });
            props.canvas.fire('object:modified');
            props.canvas.requestRenderAll();
        }
    };
    const [textSize, setTextSize] = React.useState(12);
    const handleTextSize = (e) => {
        setTextSize(e.target.value);
        props.activeObj.set({
            fontSize: e.target.value,
        });
        props.canvas.requestRenderAll();
    };
    const [textWeight, setTextWeight] = React.useState('normal');
    const handleTextWeight = (e) => {
        let newWeight = textWeight === 'normal' ? 'bold' : 'normal';
        setTextWeight(newWeight);
        props.activeObj.set({
            fontWeight: newWeight,
        });
        props.canvas.fire('object:modified');
        props.canvas.requestRenderAll();
    };
    const [textStyle, setTextStyle] = React.useState('normal');
    const handleTextStyle = () => {
        let newStyle = textStyle === 'normal' ? 'italic' : 'normal';
        setTextStyle(newStyle);
        props.activeObj.set({
            fontStyle: newStyle,
        });
        props.canvas.fire('object:modified');
        props.canvas.requestRenderAll();
    };
    const [textUnderline, setTextUnderline] = React.useState(false);
    const handleTextUnderline = () => {
        setTextUnderline(!textUnderline);
        props.activeObj.set({
            underline: !textUnderline,
        });
        props.canvas.fire('object:modified');
        props.canvas.requestRenderAll();
    };
    const [textAlign, setTextAlign] = React.useState('');
    const handleTextAlgin = (align) => {
        setTextAlign(align);
        props.activeObj.set({
            textAlign: align,
        });
        props.canvas.fire('object:modified');
        props.canvas.requestRenderAll();
    };
    const [textLineHeight, setTextLineHeight] = React.useState(0);
    const handleTextLineHeight = (e) => {
        setTextLineHeight(e.target.value);
        props.activeObj.set({
            lineHeight: e.target.value,
        });
        props.canvas.requestRenderAll();
    };
    const [textSpacing, setTextSpacing] = React.useState(0);
    const handleTextSpacing = (e) => {
        setTextSpacing(e.target.value);
        props.activeObj.set({
            charSpacing: e.target.value,
        });
        props.canvas.requestRenderAll();
    };

    // get current text styles
    React.useEffect(() => {
        if (props.activeObj.type === 'i-text') {
            setTextFont(props.activeObj.fontFamily);
            setTextSize(props.activeObj.fontSize);
            setTextWeight(props.activeObj.fontWeight);
            setTextStyle(props.activeObj.fontStyle);
            setTextUnderline(props.activeObj.underline);
            setTextAlign(props.activeObj.textAlign);
            setTextLineHeight(props.activeObj.lineHeight);
            setTextSpacing(props.activeObj.charSpacing);
        }
    }, [props.activeObj]);

    // jsx
    const textSizeArray = [6, 8, 10, 12, 14, 16, 18, 20, 24, 36, 48, 72];
    const textSizeOptions = textSizeArray.map((size, index) => <option key={index}>{size}</option>);

    // render
    return (
        <div className='specificNav textNav'>
            <NavLeftColor
                canvas={props.canvas}
                activeObj={props.activeObj}
                trackOutSideClick={props.trackOutSideClick}
                setIsFocusInput={props.setIsFocusInput}
            />
            <select className='specificButton' value={textFont} onChange={handleTextFont}>
                <option value='Sans-serif'>預設字體</option>
                <option value='JetBrains Mono'>JetBrains Mono</option>
                <option value='Raleway'>Raleway</option>
                <option value='Montserrat Alternates'>Montserrat Alternates</option>
            </select>
            <div className='sizeBoxOuter'>
                <icons.TextSize className='specificButton textIcon' onClick={toggleSizeSelection} />
                {isChoosingSize && (
                    <div className='sizeBoxes'>
                        <div className='sizeBoxText'>大小</div>
                        <input
                            className='inputRange'
                            type='range'
                            min='8'
                            max='100'
                            value={textSize}
                            onInput={handleTextSize}
                            step='1'
                        ></input>
                    </div>
                )}
            </div>
            <icons.TextBold
                className={`specificButton textIcon ${
                    textWeight === 'bold' ? 'textButtonActive' : ''
                }`}
                onClick={handleTextWeight}
            />
            <icons.TextItalic
                className={`specificButton textIcon ${
                    textStyle === 'italic' ? 'textButtonActive' : ''
                }`}
                onClick={handleTextStyle}
            />
            <icons.TextUnderline
                className={`specificButton textIcon ${textUnderline ? 'textButtonActive' : ''}`}
                onClick={handleTextUnderline}
            />
            <icons.TextAlignLeft
                className={`specificButton textIcon ${
                    textAlign === 'left' ? 'textButtonActive' : ''
                }`}
                onClick={() => handleTextAlgin('left')}
            />
            <icons.TextAlignCenter
                className={`specificButton textIcon ${
                    textAlign === 'center' ? 'textButtonActive' : ''
                }`}
                onClick={() => handleTextAlgin('center')}
            />
            <icons.TextAlignRight
                className={`specificButton textIcon ${
                    textAlign === 'right' ? 'textButtonActive' : ''
                }`}
                onClick={() => handleTextAlgin('right')}
            />
            <div className='spaceBoxOuter'>
                <icons.TextSpace className='specificButton' onClick={toggleSpaceSelection} />
                {isChoosingSpace && (
                    <div className='spaceBoxes'>
                        <div className='spaceBox'>
                            <div className='spaceBoxText'>行距</div>
                            <input
                                className='inputRange'
                                type='range'
                                min='0'
                                max='2'
                                value={textLineHeight}
                                onInput={handleTextLineHeight}
                                step='0.1'
                            ></input>
                            <div className='rangeValue'>{textLineHeight}</div>
                        </div>
                        <div className='spaceBox'>
                            <div className='spaceBoxText'>字距</div>
                            <input
                                className='inputRange'
                                type='range'
                                min='-100'
                                max='500'
                                value={textSpacing}
                                onInput={handleTextSpacing}
                                step='5'
                            ></input>
                            <div className='rangeValue'>{textSpacing}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

NavLeftText.propTypes = {
    setTextIsEditing: PropTypes.func.isRequired,
    canvas: PropTypes.object.isRequired,
    activeObj: PropTypes.object.isRequired,
    trackOutSideClick: PropTypes.func.isRequired,
    setIsFocusInput: PropTypes.func,
};

export default NavLeftText;
