import { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import 'fabric-history';
import arrowLeft from '../../../../img/src/arrowLeft.svg';
import arrowRight from '../../../../img/src/arrowRight.svg';
import NavRight from './NavRight';
import NavLeftText from './NavLeftText';
import NavLeftImg from './NavLeftImg';
import NavLeftShape from './NavLeftShape';
import NavLeftColor from './NavLeftColor';

const ComponentsSelection = (props) => {
    const scrollContainerRef = useRef(null);
    const [croppingObj, setCroppingObj] = useState({});
    const [textIsEditing, setTextIsEditing] = useState(false);
    const [showScroll, setShowScroll] = useState(false);
    const [arrowState, setArrowState] = useState('right');
    const [showMobileScrollContainer, setShowMobileScrollContainer] = useState(false);
    const listenScroll = (e) => {
        const scrollRight = e.target.scrollWidth - e.target.clientWidth - e.target.scrollLeft;
        e.target.scrollLeft !== 0 && scrollRight > 1
            ? setArrowState('both')
            : scrollRight <= 1
            ? setArrowState('left')
            : e.target.scrollLeft === 0
            ? setArrowState('right')
            : null;
    };
    const swipeHandler = (e, direction) => {
        const swipeContainer = e.currentTarget.parentNode;
        direction === 'left'
            ? (swipeContainer.scrollLeft -= swipeContainer.clientWidth / 3)
            : (swipeContainer.scrollLeft += swipeContainer.clientWidth / 3);
    };

    useEffect(() => {
        scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth
            ? setShowScroll(true)
            : setShowScroll(false);
    }, [props.activeObj]);

    return (
        <div
            className={`componentsSelection ${
                props.currentSidebar !== '' ? 'componentsSelectionUnfold' : ''
            }`}
        >
            <div
                ref={scrollContainerRef}
                className={`scrollContainer ${showMobileScrollContainer ? 'unfoldScrollContainer' : ''}`}
                onScroll={listenScroll}
            >
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
                                setIsShowMobileSidebar={props.setIsShowMobileSidebar}
                            />
                        )}
                    {props.activeObj.type === 'i-text' && (
                        <NavLeftText
                            setTextIsEditing={setTextIsEditing}
                            canvas={props.canvas}
                            activeObj={props.activeObj}
                            setIsFocusInput={props.setIsFocusInput}
                            setShowMobileScrollContainer={setShowMobileScrollContainer}
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
                    setShowMobileScrollContainer={setShowMobileScrollContainer}
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
    setIsShowMobileSidebar: PropTypes.func.isRequired,
};

export default memo(ComponentsSelection);
