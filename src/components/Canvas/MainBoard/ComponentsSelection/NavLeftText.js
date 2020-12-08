import React from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../../../img/icons';
import NavLeftColor from './NavLeftColor';

const NavLeftText = (props) => {
    // unfold nav
    const [isChoosingSpace, setIsChoosingSpace] = React.useState(false);
    const toggleSpaceSelection = (e) => {
        setIsChoosingSpace(true);
        props.trackOutSideClick(e.currentTarget, () => {
            setIsChoosingSpace(false);
            props.canvas.fire('object:modified');
        });
    };
    // -- text state
    const [textFont, setTextFont] = React.useState('sans-serif');
    const FontFaceObserver = require('fontfaceobserver');
    const handleTextFont = (e) => {
        setTextFont(e.target.value);
        const myFont = new FontFaceObserver(e.target.value);
        myFont.load().then(function () {
            props.activeObj.set({
                fontFamily: e.target.value,
            });
            props.canvas.requestRenderAll();
        });
        props.canvas.fire('object:modified');
    };
    const [textSize, setTextSize] = React.useState(12);
    const handleTextSize = (e) => {
        setTextSize(e.target.value);
        props.activeObj.set({
            fontSize: e.target.value,
        });
        props.canvas.requestRenderAll();
        props.canvas.fire('object:modified');
    };
    const [textWeight, setTextWeight] = React.useState('normal');
    const handleTextWeight = (e) => {
        let newWeight = textWeight === 'normal' ? 'bold' : 'normal';
        setTextWeight(newWeight);
        props.activeObj.set({
            fontWeight: newWeight,
        });
        props.canvas.requestRenderAll();
        props.canvas.fire('object:modified');
    };
    const [textStyle, setTextStyle] = React.useState('normal');
    const handleTextStyle = () => {
        let newStyle = textStyle === 'normal' ? 'italic' : 'normal';
        setTextStyle(newStyle);
        props.activeObj.set({
            fontStyle: newStyle,
        });
        props.canvas.requestRenderAll();
        props.canvas.fire('object:modified');
    };
    const [textUnderline, setTextUnderline] = React.useState(false);
    const handleTextUnderline = () => {
        setTextUnderline(!textUnderline);
        props.activeObj.set({
            underline: !textUnderline,
        });
        props.canvas.requestRenderAll();
        props.canvas.fire('object:modified');
    };
    const [textAlign, setTextAlign] = React.useState('');
    const handleTextAlgin = (align) => {
        setTextAlign(align);
        props.activeObj.set({
            textAlign: align,
        });
        props.canvas.requestRenderAll();
        props.canvas.fire('object:modified');
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
            />
            <select className='specificButton' value={textFont} onChange={handleTextFont}>
                <option value='sans-serif'>預設字體</option>
                <option value='Noto Sans TC'>思源黑體</option>
                <option value='Noto Serif TC'>思源宋體</option>
            </select>
            <div className='specificButton textSizeOuter'>
                <select className='textSizeSelect' value={textSize} onChange={handleTextSize}>
                    {textSizeOptions}
                </select>
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
                {isChoosingSpace ? (
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
                ) : null}
            </div>
        </div>
    );
};

NavLeftText.propTypes = {
    setTextIsEditing: PropTypes.func.isRequired,
    canvas: PropTypes.object.isRequired,
    activeObj: PropTypes.object.isRequired,
    trackOutSideClick: PropTypes.func.isRequired,
};

export default NavLeftText;
