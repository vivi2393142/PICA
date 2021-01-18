import { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/canvas.scss';
import MainBoard from './MainBoard';
import Banner from './Banner';
import * as backImg from '../../img/background';
import * as firebase from '../../utils/firebase.js';
import * as canvasInitUtils from '../../utils/canvasInit';
import * as utils from '../../utils/globalUtils';
import Loader from '../Loader';
import { useHistory } from 'react-router-dom';

const Background = () => {
    return (
        <div className='backImages'>
            <backImg.BackY1 className='backImg backY1' />
            <backImg.BackY2 className='backImg backY2' />
            <backImg.BackW1 className='backImg backW1' />
            <backImg.BackW2 className='backImg backW2' />
            <backImg.BackW3 className='backImg backW3' />
            <backImg.BackW4 className='backImg backW4' />
            <backImg.BackG1 className='backImg backG1' />
            <backImg.BackG2 className='backImg backG2' />
            <backImg.BackL1 className='backImg backL1' />
            <backImg.BackL2 className='backImg backL2' />
        </div>
    );
};

const Canvas = (props) => {
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(true);
    const [canvas, setCanvas] = useState({});
    const [canvasSetting, setCanvasSetting] = useState({});
    const [canvasData, setCanvasData] = useState({});
    const [ratioSelectValue, setRatioSelectValue] = useState('auto');
    const [activeObj, setActiveObj] = useState({});
    const [saveDragItem, setSaveDragItem] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isFocusInput, setIsFocusInput] = useState(false);
    const [triggerSaveStatus, setTriggerSaveStatus] = useState(false);
    const [isMobileZoomIn, setIsMobileZoomIn] = useState(false);

    useEffect(() => {
        // redirect if isn't author
        if (
            canvasSetting.userEmail &&
            props.currentUser.email &&
            canvasSetting.userEmail !== props.currentUser.email
        ) {
            history.push('/main/explore');
        }
    }, [props.currentUser, canvasSetting]);

    useEffect(() => {
        // get firebase data according to URL params
        canvasInitUtils.preloadFontFace();
        firebase.loadCanvas(
            canvas,
            (canvasSettingInit, canvasDataInit, snapshotInit) => {
                // init canvas
                setCanvasSetting(canvasSettingInit);
                setCanvasData(canvasDataInit);
                const canvasInit = new fabric.Canvas('fabric-canvas', {
                    height: canvasSettingInit.height,
                    width: canvasSettingInit.width,
                    objectChaching: false,
                });
                canvasInit.offHistory();
                canvasInit.loadFromJSON(canvasDataInit, presetObjectStyle);
                async function presetObjectStyle() {
                    await canvasInit.renderAll();
                    setIsLoaded(false);
                    canvasInitUtils.presetSpecialElements(canvasInit, canvasSettingInit);
                    canvasInitUtils.autoSaveInit(canvasInit, canvasSettingInit, props.match.params.id);
                    canvasInitUtils.initActiveObjectTracking(canvasInit, setActiveObj);
                    canvasInit.on('drop', dropItemHandler);
                    canvasInit.onHistory();
                    canvasInit.clearHistory();
                    // save init dataURL
                    firebase.firstSavaDataURL(canvasInit, props.match.params.id);
                }
                canvasInitUtils.presetFabricStyles(canvasInit);
                utils.setViewToFitWindow(canvasSettingInit);
                canvasInitUtils.presetCustomBorder();
                setCanvas(canvasInit);
                // dnd components event
                // -- save drag item
                const itemDragOffset = { offsetX: 0, offsetY: 0 };
                let movingItem = {};
                const saveDragItemFunc = (e) => {
                    if (e.target.draggable) {
                        itemDragOffset.offsetX =
                            e.clientX - e.target.offsetParent.offsetLeft - e.target.offsetLeft;
                        itemDragOffset.offsetY =
                            e.clientY - e.target.offsetParent.offsetTop - e.target.offsetTop;
                        movingItem = e.target;
                    }
                };
                setSaveDragItem({ func: saveDragItemFunc });
                const successCallback = () => {
                    movingItem = {};
                };
                // -- set drop item
                const dropItemHandler = (e) =>
                    canvasInitUtils.dropItemHandler(
                        e,
                        movingItem,
                        canvasInit,
                        canvasSettingInit,
                        itemDragOffset,
                        successCallback
                    );
                // fabric zoom in function to fix image view quality
                utils.initViewZoomIn(canvasInit, canvasSettingInit);
                // show save status when firebase find new update
                const unsubscribe = firebase.listenCanvas(
                    props.match.params.id,
                    (files) => setUploadedFiles(files),
                    () => setTriggerSaveStatus(true)
                );
                return () => {
                    unsubscribe();
                };
            },
            props.match.params.id
        );
    }, []);

    return (
        <div className='Canvas'>
            {isLoaded ? <Loader></Loader> : null}
            <Background />
            <Banner
                canvasSetting={canvasSetting}
                setCanvasSetting={setCanvasSetting}
                canvas={canvas}
                setRatioSelectValue={setRatioSelectValue}
                fileId={props.match.params.id}
                currentUser={props.currentUser}
                setIsFocusInput={setIsFocusInput}
                triggerSaveStatus={triggerSaveStatus}
                setTriggerSaveStatus={setTriggerSaveStatus}
            />
            <MainBoard
                currentUser={props.currentUser}
                fileId={props.match.params.id}
                isFocusInput={isFocusInput}
                setIsFocusInput={setIsFocusInput}
                ratioSelectValue={ratioSelectValue}
                setRatioSelectValue={setRatioSelectValue}
                canvasSetting={canvasSetting}
                setCanvasSetting={setCanvasSetting}
                canvas={canvas}
                activeObj={activeObj}
                setActiveObj={setActiveObj}
                saveDragItem={saveDragItem}
                uploadedFiles={uploadedFiles}
                canvasData={canvasData}
                isMobileZoomIn={isMobileZoomIn}
                setIsMobileZoomIn={setIsMobileZoomIn}
            />
        </div>
    );
};

Canvas.propTypes = {
    match: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
};

export default memo(Canvas);
