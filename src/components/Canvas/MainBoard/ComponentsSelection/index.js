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
    const allSettings = props.allSettings;
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
    }, [allSettings.activeObj]);

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
                    <div
                        className='directionButton right'
                        onClick={(e) => swipeHandler(e, 'right')}
                    >
                        <img src={arrowLeft}></img>
                    </div>
                )}
                <div className='componentsNavLeft'>
                    {(allSettings.activeObj.type === 'rect' ||
                        allSettings.activeObj.type === 'circle' ||
                        allSettings.activeObj.type === 'triangle' ||
                        allSettings.activeObj.type === 'path' ||
                        allSettings.activeObj.type === 'polygon') &&
                        allSettings.activeObj.specialType !== 'cropbox' && (
                            <NavLeftColor
                                canvas={allSettings.canvas}
                                activeObj={allSettings.activeObj}
                                setIsFocusInput={props.setIsFocusInput}
                            />
                        )}
                    {(allSettings.activeObj.type === 'image' || croppingObj !== {}) &&
                        allSettings.activeObj.specialType !== 'background' && (
                            <NavLeftImg
                                currentSidebar={props.currentSidebar}
                                setCurrentSidebar={props.setCurrentSidebar}
                                croppingObj={croppingObj}
                                setCroppingObj={setCroppingObj}
                                allSettings={allSettings}
                            />
                        )}
                    {allSettings.activeObj.type === 'i-text' && (
                        <NavLeftText
                            setTextIsEditing={setTextIsEditing}
                            canvas={allSettings.canvas}
                            activeObj={allSettings.activeObj}
                            setIsFocusInput={props.setIsFocusInput}
                        />
                    )}
                    {(allSettings.activeObj.type === 'rect' ||
                        allSettings.activeObj.type === 'circle' ||
                        allSettings.activeObj.type === 'triangle') &&
                        allSettings.activeObj.specialType !== 'cropbox' && (
                            <NavLeftShape
                                canvas={allSettings.canvas}
                                activeObj={allSettings.activeObj}
                                setIsFocusInput={props.setIsFocusInput}
                            />
                        )}
                </div>
                <NavRight
                    textIsEditing={textIsEditing}
                    canvas={allSettings.canvas}
                    canvasData={allSettings.canvasData}
                    canvasSetting={allSettings.canvasSetting}
                    activeObj={allSettings.activeObj}
                    setActiveObj={allSettings.setActiveObj}
                    isFocusInput={props.isFocusInput}
                />
            </div>
        </div>
    );
};

ComponentsSelection.propTypes = {
    currentSidebar: PropTypes.string.isRequired,
    setCurrentSidebar: PropTypes.func.isRequired,
    allSettings: PropTypes.object.isRequired,
    isFocusInput: PropTypes.bool.isRequired,
    setIsFocusInput: PropTypes.func.isRequired,
};

export default ComponentsSelection;
