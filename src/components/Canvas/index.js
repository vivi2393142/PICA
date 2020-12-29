import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../css/canvas.scss';
import MainBoard from './MainBoard';
import Banner from './Banner';
import * as backImg from '../../img/background';
import * as firebase from '../../utils/firebase.js';
import * as utils from '../../utils/utils';
import * as config from '../../utils/config';
import Loader from '../Loader';
import { useHistory } from 'react-router-dom';

const setMovingItemType = (movingItem) => {
    const sidebarNode = movingItem.parentNode;
    const sidebarNodeForImg = sidebarNode.parentNode.parentNode;
    const movingItemType =
        sidebarNodeForImg.classList.contains('sidebarUnfoldImg') ||
        sidebarNode.classList.contains('unfoldItemImgWrapper')
            ? 'img'
            : sidebarNode.classList.contains('sidebarUnfoldText')
            ? 'text'
            : sidebarNode.classList.contains('sidebarUnfoldShape')
            ? 'shape'
            : sidebarNode.classList.contains('sidebarUnfoldLine')
            ? 'line'
            : sidebarNodeForImg.classList.contains('sidebarUnfoldSticker')
            ? 'sticker'
            : '';
    const shapeItemType = movingItem.classList.contains('rectShape')
        ? 'rect'
        : movingItem.classList.contains('radiusRectShape')
        ? 'radiusRect'
        : movingItem.classList.contains('circleShape')
        ? 'circle'
        : movingItem.classList.contains('triangleShape')
        ? 'triangle'
        : '';
    return { movingItemType, shapeItemType };
};
const showSaveStatus = () => {
    if (document.querySelector('.status')) {
        document.querySelector('.status').classList.add('showStatus');
        setTimeout(() => {
            if (document.querySelector('.status') !== null) {
                document.querySelector('.status').classList.remove('showStatus');
            }
        }, 3000);
    }
};

// export default App;
const Canvas = (props) => {
    const history = useHistory();
    const [isLoaded, setIsLoaded] = React.useState(true);
    const [canvas, setCanvas] = React.useState({});
    const [canvasSetting, setCanvasSetting] = React.useState({});
    const [canvasData, setCanvasData] = React.useState({});
    const [ratioSelectValue, setRatioSelectValue] = React.useState('auto');
    const [activeObj, setActiveObj] = React.useState({});
    const [saveDragItem, setSaveDragItem] = React.useState({});
    const [uploadedFiles, setUploadedFiles] = React.useState([]);
    const [isFocusInput, setIsFocusInput] = React.useState(false);

    // handleSaveFile
    const handleSaveFile = (canvas, canvasSetting) => {
        firebase.saveCanvasData(canvas, canvasSetting, props.match.params.id);
    };

    React.useEffect(() => {
        // ---- if currentUser is not the one
        if (
            canvasSetting.userEmail &&
            props.currentUser.email &&
            canvasSetting.userEmail !== props.currentUser.email
        ) {
            history.push('/main/explore');
        }
    }, [props.currentUser, canvasSetting]);

    React.useEffect(() => {
        // get firebase data according to URL params
        const FontFaceObserver = require('fontfaceobserver');
        const fontsArray = ['JetBrains Mono', 'Raleway', 'Montserrat Alternates'];
        Promise.all(fontsArray.map((font) => new FontFaceObserver(font).load())).then(() => {});
        firebase.loadCanvas(
            canvas,
            (canvasSettingInit, canvasDataInit, snapshotInit) => {
                // set canvas setting state by firebase canvas data
                setCanvasSetting(canvasSettingInit);
                setCanvasData(canvasDataInit);
                // create new canvas then load firebase data in
                const canvasInit = new fabric.Canvas('fabric-canvas', {
                    height: canvasSettingInit.height,
                    width: canvasSettingInit.width,
                    objectChaching: false,
                });
                canvasInit.offHistory();
                canvasInit.loadFromJSON(canvasDataInit, presetObjectStyle);
                async function presetObjectStyle() {
                    // -- render initial data then clear init history
                    await canvasInit.renderAll();
                    // ---- remove loader after finishing render canvas
                    setIsLoaded(false);
                    // preset image & iText objects style
                    const imgObjects = canvasInit.getObjects('image');
                    const texObjects = canvasInit.getObjects('i-text');
                    imgObjects.forEach((object) => {
                        object.setControlsVisibility({
                            mb: false,
                            mt: false,
                            ml: false,
                            mr: false,
                        });
                    });
                    texObjects.forEach((object) => {
                        object.setControlsVisibility({
                            mb: false,
                            mt: false,
                            ml: false,
                            mr: false,
                        });
                    });
                    // preset background image object style
                    const backgroundObject = canvasInit
                        .getObjects('image')
                        .find((x) => x.specialType === 'background');
                    if (backgroundObject) {
                        canvasInit.remove(backgroundObject);
                        const scaleToWidth = canvasSettingInit.width / backgroundObject.width;
                        const scaleToHeight = canvasSettingInit.height / backgroundObject.height;
                        const scaleWay = scaleToWidth > scaleToHeight ? 'toWidth' : 'toHeight';
                        utils.presetBackgroundImg(
                            backgroundObject,
                            canvasInit,
                            canvasSettingInit,
                            scaleWay,
                            scaleToWidth,
                            scaleToHeight
                        );
                    }
                    // preset shape and sticker special type
                    const stickerObjects = canvasInit
                        .getObjects('image')
                        .filter((x) => x.specialType === 'sticker');
                    if (stickerObjects.length !== 0) {
                        stickerObjects.forEach((sticker) => {
                            canvasInit.remove(sticker);
                            sticker.toObject = (function (toObject) {
                                return function (propertiesToInclude) {
                                    return fabric.util.object.extend(
                                        toObject.call(this, propertiesToInclude),
                                        {
                                            specialType: 'sticker', //my custom property
                                        }
                                    );
                                };
                            })(sticker.toObject);
                            canvasInit.add(sticker);
                            sticker.setControlsVisibility({
                                mb: false,
                                mt: false,
                                ml: false,
                                mr: false,
                            });
                        });
                    }
                    // fabric listeners
                    // -- listen to all changes -> update database
                    canvasInit.on('object:modified', (e) => {
                        if (e.target) {
                            if (
                                e.target.specialType === 'cropBackground' ||
                                e.target.specialType === 'cropbox'
                            ) {
                                return;
                            }
                        }
                        console.log('編輯完畢');
                        handleSaveFile(canvasInit, canvasSettingInit);
                    });
                    canvasInit.on('object:added', (e) => {
                        if (e.target) {
                            if (
                                e.target.specialType === 'cropBackground' ||
                                e.target.specialType === 'cropbox'
                            ) {
                                return;
                            }
                        }
                        console.log('新增完畢');
                        handleSaveFile(canvasInit, canvasSettingInit);
                    });
                    canvasInit.on('object:removed', (e) => {
                        if (e.target) {
                            if (e.target.specialType === 'cropBackground') {
                                return;
                            }
                        }
                        console.log('移除完畢');
                        handleSaveFile(canvasInit, canvasSettingInit);
                    });

                    // -- listen to all changes -> set active obj
                    canvasInit.on('selection:created', (e) => {
                        setActiveObj(e.target);
                    });
                    canvasInit.on('selection:updated', (e) => {
                        setActiveObj(e.target);
                    });
                    canvasInit.on('selection:cleared', (e) => {
                        setActiveObj({});
                    });
                    // -- listen to drop event -> execute drop function
                    canvasInit.on('drop', (e) => {
                        dropItem(e, canvasInit);
                    });
                    canvasInit.onHistory();
                    canvasInit.clearHistory();
                }
                //save dataURL if non
                if (!snapshotInit) {
                    firebase.firstSavaDataURL(canvasInit, props.match.params.id);
                }
                utils.presetFabricStyles(canvasInit);
                // set canvas
                setCanvas(canvasInit);
                // responsive canvas size
                const container = document.querySelector('.canvas-container');
                container.style.border = '2.8rem solid transparent';
                document.querySelector('.lower-canvas').style.width = '100%';
                document.querySelector('.lower-canvas').style.height = '100%';
                document.querySelector('.upper-canvas').style.width = '100%';
                document.querySelector('.upper-canvas').style.height = '100%';
                // -- default view ratio: auto
                const fixRatio = Math.min(
                    (window.innerWidth * 0.72) / canvasSettingInit.width,
                    (window.innerHeight * 0.72) / canvasSettingInit.height
                );
                container.style.width = `${fixRatio * canvasSettingInit.width}px`;
                container.style.height = `${fixRatio * canvasSettingInit.height}px`;

                // -- customize border style
                // console.log(fixRatio);
                const customBorder = {
                    borderColor: 'rgba(0,0,0,0.25)',
                    cornerColor: 'rgba(0,0,0,0.25)',
                    cornerStrokeColor: 'rgba(0,0,0,0.25)',
                    cornerSize: 10,
                    cornerStyle: 'circle',
                    cornerColor: 'white',
                };
                fabric.Object.prototype.set(customBorder);

                // dnd components event
                // --- save the dragging target
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
                // --- listener to drop then add the dragging one
                const dropItem = (e) => {
                    if (Object.keys(movingItem).length !== 0) {
                        // set position
                        const { offsetX, offsetY } = e.e;
                        const viewWidth = parseInt(
                            document.querySelector('.canvas-container').style.width
                        );
                        const settingWidth = canvasSettingInit.width;
                        const currentSizeRatio = viewWidth / settingWidth;
                        const targetOriginWidth = parseInt(movingItem.parentNode.style.width);
                        const layoutZoomRatio = Number.isNaN(targetOriginWidth)
                            ? 1
                            : targetOriginWidth / 100;
                        const position = {
                            top:
                                (offsetY - itemDragOffset.offsetY * layoutZoomRatio) /
                                currentSizeRatio,
                            left:
                                (offsetX - itemDragOffset.offsetX * layoutZoomRatio) /
                                currentSizeRatio,
                        };
                        const getMovingItemType = setMovingItemType(movingItem);
                        const movingItemType = getMovingItemType.movingItemType;
                        const shapeItemType = getMovingItemType.shapeItemType;
                        // add item
                        movingItemType === 'img'
                            ? utils.addImage(movingItem, position, canvasInit, canvasSettingInit)
                            : movingItemType === 'text'
                            ? utils.addIText(
                                  position,
                                  canvasInit,
                                  canvasSettingInit,
                                  config.textSetting.findIndex(
                                      (item) => item.content === movingItem.textContent
                                  )
                              )
                            : movingItemType === 'shape'
                            ? shapeItemType === 'rect'
                                ? utils.addRect(position, canvasInit, canvasSettingInit)
                                : shapeItemType === 'radiusRect'
                                ? utils.addRadiusRect(position, canvasInit, canvasSettingInit)
                                : shapeItemType === 'circle'
                                ? utils.addCircle(position, canvasInit, canvasSettingInit)
                                : shapeItemType === 'triangle'
                                ? utils.addTriangle(position, canvasInit, canvasSettingInit)
                                : utils.addShape(
                                      movingItem.src,
                                      position,
                                      canvasInit,
                                      canvasSettingInit
                                  )
                            : movingItemType === 'line'
                            ? utils.addShape(
                                  movingItem.src,
                                  position,
                                  canvasInit,
                                  canvasSettingInit
                              )
                            : movingItemType === 'sticker'
                            ? utils.addSticker(movingItem, position, canvasInit, canvasSettingInit)
                            : null;
                        movingItem = {};
                    }
                };
                const currentSizeRatio =
                    parseInt(document.querySelector('.canvas-container').style.width) /
                    canvasSettingInit.width;
                canvasInit.setZoom(currentSizeRatio);
                canvasInit.setWidth(canvasSettingInit.width * canvasInit.getZoom());
                canvasInit.setHeight(canvasSettingInit.height * canvasInit.getZoom());
                document.querySelectorAll('.drawingArea').forEach((item) => {
                    item.style.width = '100%';
                    item.style.height = '100%';
                });
                // show save status when firebase find new update
                firebase.listenCanvas(props.match.params.id, showSaveStatus, (files) =>
                    setUploadedFiles(files)
                );
            },
            props.match.params.id
        );
    }, []);

    const allSettings = {
        canvasSetting,
        setCanvasSetting,
        canvasData,
        setCanvasData,
        canvasSetting,
        setCanvasSetting,
        canvas,
        setCanvas,
        ratioSelectValue,
        setRatioSelectValue,
        activeObj,
        setActiveObj,
        saveDragItem,
        uploadedFiles,
        // presetBackgroundImg,
    };

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

    // render
    return (
        <div className='Canvas'>
            {isLoaded ? <Loader></Loader> : null}
            <Background />
            <Banner
                allSettings={allSettings}
                fileId={props.match.params.id}
                currentUser={props.currentUser}
                setIsFocusInput={setIsFocusInput}
            />
            <MainBoard
                allSettings={allSettings}
                currentUser={props.currentUser}
                fileId={props.match.params.id}
                isFocusInput={isFocusInput}
                setIsFocusInput={setIsFocusInput}
            />
        </div>
    );
};

Canvas.propTypes = {
    match: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
};

export default Canvas;
