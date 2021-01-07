import React from 'react';
import PropTypes from 'prop-types';
import DrawingArea from './DrawingArea';
import Sidebar from './Sidebar/index';
import ComponentsSelection from './ComponentsSelection/index';
import * as utils from '../../../utils/globalUtils';
import * as config from '../../../utils/globalConfig';
import * as icons from '../../../img/mainPage';

const MainBoard = (props) => {
    const [currentSidebar, setCurrentSidebar] = React.useState('');
    const [isShowMobileSidebar, setIsShowMobileSidebar] = React.useState(false);

    // responsive view handling
    const handleRatioSelect = (e) => {
        const selectedRatio = e.target.value;
        props.setRatioSelectValue(selectedRatio);
        selectedRatio === 'auto'
            ? utils.setViewToFitWindow(props.canvasSetting)
            : utils.setViewToSelectedRatio(selectedRatio, props.canvasSetting);
        utils.initViewZoomIn(props.canvas, props.canvasSetting);
    };
    const handleMobileRatioButton = (e) => {
        const container = document.querySelector('.canvas-container');
        const currentRatio = parseInt(container.style.width) / props.canvasSetting.width;
        if (props.isMobileZoomIn) {
            utils.setViewToFitWindow(props.canvasSetting);
            props.setRatioSelectValue('auto');
            props.setIsMobileZoomIn(false);
        } else {
            utils.setViewToSelectedRatio(currentRatio * 2 * 100, props.canvasSetting);
            props.setRatioSelectValue(`${currentRatio * 2 * 100}%`);
            props.setIsMobileZoomIn(true);
        }
        utils.initViewZoomIn(props.canvas, props.canvasSetting);
    };
    // mobile sidebar toggle - show sidebar
    const openMobileSidebar = () => {
        setIsShowMobileSidebar(true);
    };
    const closeMobileSidebar = () => {
        setIsShowMobileSidebar(false);
        setTimeout(() => {
            setCurrentSidebar('');
        }, 1000);
    };

    const zoomInSelection = (
        <select className='ratioSelect' value={props.ratioSelectValue} onChange={handleRatioSelect}>
            {config.ratioOptions.map((item, index) => (
                <option key={index} value={item}>
                    {item}%
                </option>
            ))}
            <option value='auto'>符合畫面大小</option>
        </select>
    );
    const mobileZoomInButton = (
        <div className='mobileZoomInButton' onClick={handleMobileRatioButton}>
            {props.isMobileZoomIn ? (
                <icons.ZoomOut className='innerIcon' />
            ) : (
                <icons.ZoomIn className='innerIcon' />
            )}
        </div>
    );
    const mobileSidebarAddJsx = (
        <div className='mobileSidebarAdd' onClick={openMobileSidebar}>
            +
        </div>
    );

    return (
        <div className='mainBoard'>
            {zoomInSelection}
            {mobileZoomInButton}
            {mobileSidebarAddJsx}
            {isShowMobileSidebar && <div className='mobileCover' onClick={closeMobileSidebar}></div>}
            <Sidebar
                isShowMobileSidebar={isShowMobileSidebar}
                setIsShowMobileSidebar={setIsShowMobileSidebar}
                currentSidebar={currentSidebar}
                setCurrentSidebar={setCurrentSidebar}
                currentUser={props.currentUser}
                fileId={props.fileId}
                setIsFocusInput={props.setIsFocusInput}
                canvasSetting={props.canvasSetting}
                canvas={props.canvas}
                activeObj={props.activeObj}
                saveDragItem={props.saveDragItem}
                uploadedFiles={props.uploadedFiles}
            />
            <div className='drawingAreaBox'>
                <ComponentsSelection
                    currentSidebar={currentSidebar}
                    setCurrentSidebar={setCurrentSidebar}
                    isFocusInput={props.isFocusInput}
                    setIsFocusInput={props.setIsFocusInput}
                    activeObj={props.activeObj}
                    setActiveObj={props.setActiveObj}
                    canvas={props.canvas}
                    canvasData={props.canvasData}
                    canvasSetting={props.canvasSetting}
                    setIsShowMobileSidebar={setIsShowMobileSidebar}
                />
                <DrawingArea
                    canvasSetting={props.canvasSetting}
                    ratioSelectValue={props.ratioSelectValue}
                    isMobileZoomIn={props.isMobileZoomIn}
                />
            </div>
        </div>
    );
};

MainBoard.propTypes = {
    currentUser: PropTypes.object,
    fileId: PropTypes.string.isRequired,
    isFocusInput: PropTypes.bool.isRequired,
    setIsFocusInput: PropTypes.func.isRequired,
    ratioSelectValue: PropTypes.string.isRequired,
    setRatioSelectValue: PropTypes.func.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    setCanvasSetting: PropTypes.func.isRequired,
    canvas: PropTypes.object.isRequired,
    activeObj: PropTypes.object.isRequired,
    setActiveObj: PropTypes.func.isRequired,
    saveDragItem: PropTypes.object.isRequired,
    uploadedFiles: PropTypes.array.isRequired,
    canvasData: PropTypes.object.isRequired,
    isMobileZoomIn: PropTypes.bool.isRequired,
    setIsMobileZoomIn: PropTypes.func.isRequired,
};

export default React.memo(MainBoard);
