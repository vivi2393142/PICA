import React from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import 'fabric-history';
import * as icons from '../../../../img/icons';
import arrowLeft from '../../../../img/src/arrowLeft.svg';
import arrowRight from '../../../../img/src/arrowRight.svg';
import NavRight from './NavRight';
import NavLeftText from './NavLeftText';
import NavLeftImg from './NavLeftImg';
import NavLeftShape from './NavLeftShape';
import NavLeftColor from './NavLeftColor';

const ComponentsSelection = (props) => {
    const [croppingObj, setCroppingObj] = React.useState({});
    const [textIsEditing, setTextIsEditing] = React.useState(false);
    const [showScroll, setShowScroll] = React.useState(false);
    const [arrowState, setArrowState] = React.useState('right');
    const listenScroll = (e) => {
        const scrollRight = e.target.scrollWidth - e.target.clientWidth - e.target.scrollLeft;
        if (e.target.scrollLeft !== 0 && scrollRight > 1) {
            setArrowState('both');
        } else if (scrollRight <= 1) {
            setArrowState('left');
        } else if (e.target.scrollLeft === 0) {
            setArrowState('right');
        }
    };
    const swipeHandler = (e, direction) => {
        if (direction === 'left') {
            e.currentTarget.parentNode.scrollLeft -= e.currentTarget.parentNode.clientWidth / 3;
        } else {
            e.currentTarget.parentNode.scrollLeft += e.currentTarget.parentNode.clientWidth / 3;
        }
    };

    React.useEffect(() => {
        if (
            document.querySelector('.scrollContainer').scrollWidth >
            document.querySelector('.scrollContainer').clientWidth
        ) {
            setShowScroll(true);
        } else {
            setShowScroll(false);
        }
    }, [props.activeObj]);

    // render
    return (
        <div
            className={`componentsSelection ${
                props.currentSidebar !== '' ? 'componentsSelectionUnfold' : ''
            }`}
        >
            <div className='scrollContainer' onScroll={listenScroll}>
                {showScroll && (arrowState === 'left' || arrowState === 'both') && (
                    <div className='directionButton left' onClick={(e) => swipeHandler(e, 'left')}>
                        <img src={arrowRight}></img>
                    </div>
                )}
                {showScroll && (arrowState === 'right' || arrowState === 'both') && (
                    <div className='directionButton right' onClick={(e) => swipeHandler(e, 'right')}>
                        <img src={arrowLeft}></img>
                    </div>
                )}
                <div className='componentsNavLeft'>
                    {(props.activeObj.type === 'rect' ||
                        props.activeObj.type === 'circle' ||
                        props.activeObj.type === 'triangle' ||
                        props.activeObj.type === 'path' ||
                        props.activeObj.type === 'polygon') &&
                        props.activeObj.specialType !== 'cropbox' && (
                            <NavLeftColor
                                canvas={props.canvas}
                                activeObj={props.activeObj}
                                setIsFocusInput={props.setIsFocusInput}
                            />
                        )}
                    {(props.activeObj.type === 'image' || croppingObj !== {}) &&
                        props.activeObj.specialType !== 'background' && (
                            <NavLeftImg
                                currentSidebar={props.currentSidebar}
                                setCurrentSidebar={props.setCurrentSidebar}
                                croppingObj={croppingObj}
                                setCroppingObj={setCroppingObj}
                                canvas={props.canvas}
                                canvasSetting={props.canvasSetting}
                                activeObj={props.activeObj}
                            />
                        )}
                    {props.activeObj.type === 'i-text' && (
                        <NavLeftText
                            setTextIsEditing={setTextIsEditing}
                            canvas={props.canvas}
                            activeObj={props.activeObj}
                            setIsFocusInput={props.setIsFocusInput}
                        />
                    )}
                    {(props.activeObj.type === 'rect' ||
                        props.activeObj.type === 'circle' ||
                        props.activeObj.type === 'triangle') &&
                        props.activeObj.specialType !== 'cropbox' && (
                            <NavLeftShape
                                canvas={props.canvas}
                                activeObj={props.activeObj}
                                setIsFocusInput={props.setIsFocusInput}
                            />
                        )}
                </div>
                <NavRight
                    textIsEditing={textIsEditing}
                    canvas={props.canvas}
                    canvasData={props.canvasData}
                    canvasSetting={props.canvasSetting}
                    activeObj={props.activeObj}
                    setActiveObj={props.setActiveObj}
                    isFocusInput={props.isFocusInput}
                />
            </div>
        </div>
    );
};

ComponentsSelection.propTypes = {
    currentSidebar: PropTypes.string.isRequired,
    setCurrentSidebar: PropTypes.func.isRequired,
    isFocusInput: PropTypes.bool.isRequired,
    setIsFocusInput: PropTypes.func.isRequired,
    activeObj: PropTypes.object.isRequired,
    setActiveObj: PropTypes.func.isRequired,
    canvas: PropTypes.object.isRequired,
    canvasData: PropTypes.object.isRequired,
    canvasSetting: PropTypes.object.isRequired,
};

export default React.memo(ComponentsSelection);
