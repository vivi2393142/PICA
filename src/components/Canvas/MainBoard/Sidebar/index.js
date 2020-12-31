import React from 'react';
import PropTypes from 'prop-types';
import * as config from '../../../../utils/globalConfig';
import Sample from './Sample';
import Text from './Text';
import Sticker from './Sticker';
import Shape from './Shape';
import Image from './Image';
import Line from './Line';
import Background from './Background';
import Upload from './Upload';
import ImageFilters from './ImageFilters';

const Sidebar = (props) => {
    const [nextAddPosition, setNextAddPosition] = React.useState({ top: 10, left: 10 });
    const [isAtMobile, setIsAtMobile] = React.useState(false);

    React.useEffect(() => {
        const setSizeState = () => {
            config.mediaQuerySize.big >= window.innerWidth ? setIsAtMobile(true) : setIsAtMobile(false);
        };
        setSizeState();
        window.addEventListener('resize', setSizeState);
        return () => {
            window.removeEventListener('resize', setSizeState);
        };
    }, []);
    const adjSetNextPosition = () => {
        nextAddPosition.left + 80 > props.canvasSetting.width / 2 ||
        nextAddPosition.top + 80 > props.canvasSetting.height / 2
            ? setNextAddPosition({ top: 10, left: 10 })
            : setNextAddPosition({
                  top: nextAddPosition.top + 10,
                  left: nextAddPosition.left + 10,
              });
    };

    // jsx : sidebar
    const sidebarFoldInnerJsx = config.sidebarArray.map((item, index) => (
        <div
            key={index}
            className={`sideButton ${
                props.currentSidebar === 'text' && props.currentSidebar === item.EN
                    ? 'sideButtonChosen firstButton'
                    : props.currentSidebar === 'template' && props.currentSidebar === item.EN
                    ? 'sideButtonChosen lastButton'
                    : props.currentSidebar === item.EN
                    ? 'sideButtonChosen'
                    : ''
            }`}
            onClick={() => {
                props.currentSidebar === item.EN
                    ? props.setCurrentSidebar('')
                    : props.setCurrentSidebar(item.EN);
            }}
        >
            {props.currentSidebar === item.EN ? item.icon : item.iconB}
            <div className={`iconText ${props.currentSidebar === item.EN ? 'iconTextB' : ''}`}>{item.CH}</div>
        </div>
    ));
    const sidebarFoldJsx = (
        <div className='sidebarFold'>
            {sidebarFoldInnerJsx}
            <div className='ghostDiv'></div>
            <div className='ghostDiv'></div>
            <div className='ghostDiv'></div>
            <div className='ghostDiv'></div>
            <div className='ghostDiv'></div>
            <div className='ghostDiv'></div>
        </div>
    );
    const toggleButtonJsx = (
        <div
            className='sidebarCloseButton'
            onClick={() => {
                props.setCurrentSidebar('');
            }}
        >
            {'<'}
        </div>
    );

    return (
        <div
            className={`sidebar ${props.isShowMobileSidebar ? 'mobileSidebarShow' : 'mobileSidebarHide'} ${
                props.currentSidebar !== '' ? 'showMobileUnfoldSidebar' : ''
            }`}
        >
            <div className='mobileToggle' onClick={() => setIsShowMobileSidebar(false)}></div>
            {sidebarFoldJsx}
            {props.currentSidebar !== '' && (
                <div
                    className={`sidebarUnfold sidebarUnfoldUpload ${
                        props.currentSidebar === 'text' ? 'firstUnfold' : ''
                    }`}
                >
                    <Text
                        canvas={props.canvas}
                        canvasSetting={props.canvasSetting}
                        currentSidebar={props.currentSidebar}
                        saveDragItem={props.saveDragItem}
                        isAtMobile={isAtMobile}
                        nextAddPosition={nextAddPosition}
                        adjSetNextPosition={adjSetNextPosition}
                    />
                    <Shape
                        canvas={props.canvas}
                        canvasSetting={props.canvasSetting}
                        currentSidebar={props.currentSidebar}
                        saveDragItem={props.saveDragItem}
                        isAtMobile={isAtMobile}
                        nextAddPosition={nextAddPosition}
                        adjSetNextPosition={adjSetNextPosition}
                    />
                    <Line
                        canvas={props.canvas}
                        canvasSetting={props.canvasSetting}
                        currentSidebar={props.currentSidebar}
                        saveDragItem={props.saveDragItem}
                        isAtMobile={isAtMobile}
                        nextAddPosition={nextAddPosition}
                        adjSetNextPosition={adjSetNextPosition}
                    />
                    <Image
                        canvas={props.canvas}
                        canvasSetting={props.canvasSetting}
                        currentSidebar={props.currentSidebar}
                        saveDragItem={props.saveDragItem}
                        isAtMobile={isAtMobile}
                        nextAddPosition={nextAddPosition}
                        adjSetNextPosition={adjSetNextPosition}
                    />
                    <Background
                        canvas={props.canvas}
                        canvasSetting={props.canvasSetting}
                        currentSidebar={props.currentSidebar}
                        setIsFocusInput={props.setIsFocusInput}
                        isAtMobile={isAtMobile}
                    />
                    <Upload
                        canvas={props.canvas}
                        canvasSetting={props.canvasSetting}
                        currentSidebar={props.currentSidebar}
                        setCurrentSidebar={props.setCurrentSidebar}
                        saveDragItem={props.saveDragItem}
                        uploadedFiles={props.uploadedFiles}
                        fileId={props.fileId}
                        isAtMobile={isAtMobile}
                        nextAddPosition={nextAddPosition}
                        adjSetNextPosition={adjSetNextPosition}
                    />
                    <Sticker
                        canvas={props.canvas}
                        canvasSetting={props.canvasSetting}
                        currentSidebar={props.currentSidebar}
                        saveDragItem={props.saveDragItem}
                        isAtMobile={isAtMobile}
                        nextAddPosition={nextAddPosition}
                        adjSetNextPosition={adjSetNextPosition}
                    />
                    <Sample
                        canvas={props.canvas}
                        canvasSetting={props.canvasSetting}
                        currentSidebar={props.currentSidebar}
                        isAtMobile={isAtMobile}
                    />
                    <ImageFilters
                        canvas={props.canvas}
                        activeObj={props.activeObj}
                        currentSidebar={props.currentSidebar}
                    />
                    {props.currentSidebar !== 'imageAdjustment' && toggleButtonJsx}
                </div>
            )}
        </div>
    );
};

Sidebar.propTypes = {
    currentSidebar: PropTypes.string.isRequired,
    setCurrentSidebar: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    fileId: PropTypes.string.isRequired,
    setIsFocusInput: PropTypes.func.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    canvas: PropTypes.object.isRequired,
    activeObj: PropTypes.object.isRequired,
    saveDragItem: PropTypes.object.isRequired,
    uploadedFiles: PropTypes.array.isRequired,
    isShowMobileSidebar: PropTypes.bool.isRequired,
    setIsShowMobileSidebar: PropTypes.func.isRequired,
};

export default React.memo(Sidebar);
