import React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';
import * as icons from '../../../img/icons';
import * as sidebarItems from '../../../img/sidebarItems';
import { Alert, defaultAlertSetting } from '../../Alert';
import deleteLoading from '../../../img/src/deleteLoading.svg';
import * as firebase from '../../../utils/firebase.js';
import * as utils from '../../../utils/globalUtils.js';
import * as config from '../../../utils/globalConfig';
import Sample from './Sidebar/Sample';

const Sidebar = (props) => {
    const [nextAddPosition, setNextAddPosition] = React.useState({ top: 10, left: 10 });
    const [uploadProgressValue, setUploadProgressValue] = React.useState(0);
    const [showUploadCover, setShowUploadCover] = React.useState(false);
    const [isAtMobile, setIsAtMobile] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertSetting, setAlertSetting] = React.useState({
        ...defaultAlertSetting,
    });

    // if on mobile size, disable draggable
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

    // preset background
    React.useEffect(() => {
        props.canvas.backgroundColor && setBackColorChosen({ background: props.canvas.backgroundColor });
    }, [props.canvas.backgroundColor]);

    // set next add in component position
    const adjSetNextPosition = () => {
        nextAddPosition.left + 80 > props.canvasSetting.width / 2 ||
        nextAddPosition.top + 80 > props.canvasSetting.height / 2
            ? setNextAddPosition({ top: 10, left: 10 })
            : setNextAddPosition({
                  top: nextAddPosition.top + 10,
                  left: nextAddPosition.left + 10,
              });
    };

    // handlers: uploaded function
    const fileSizeLimit = 3145680;
    const handleUploadImage = (e) => {
        if (e.target.files[0].size > fileSizeLimit) {
            setAlertSetting({
                buttonNumber: 1,
                buttonOneFunction: () => setShowAlert(false),
                buttonTwoFunction: () => {},
                buttonOneTitle: '關閉',
                buttonTwoTitle: '',
                title: '上傳錯誤',
                content: '請勿上傳超過3mb之圖片',
            });
            setShowAlert(true);
        } else {
            firebase.uploadToStorage(
                e.target.files,
                props.fileId,
                (uploadValue) => setUploadProgressValue(uploadValue),
                () => setUploadProgressValue(0)
            );
        }
    };
    ondrop = (e) => {
        e.preventDefault();
        setShowUploadCover(false);
        const files = e.dataTransfer.files;
        const basicAlertForUpload = {
            buttonNumber: 1,
            buttonOneFunction: () => setShowAlert(false),
            buttonTwoFunction: () => {},
            buttonOneTitle: '關閉',
            buttonTwoTitle: '',
            title: '上傳錯誤',
        };
        // prevent canvas drop event
        if (files.length) {
            if (files.length > 1) {
                setAlertSetting({
                    ...basicAlertForUpload,
                    content: '一次限上傳一張圖片',
                });
                setShowAlert(true);
            } else if (files[0].size > fileSizeLimit) {
                setAlertSetting({
                    ...basicAlertForUpload,
                    content: '請勿上傳超過3mb之圖片',
                });
                setShowAlert(true);
            } else if (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg') {
                setAlertSetting({
                    ...basicAlertForUpload,
                    content: '請上傳jpeg或png格式檔案',
                });
                setShowAlert(true);
            } else {
                firebase.uploadToStorage(
                    files,
                    props.fileId,
                    (uploadValue) => setUploadProgressValue(uploadValue),
                    () => setUploadProgressValue(0)
                );
            }
        }
    };
    ondragenter = (e) => {
        if (e.dataTransfer.types[0] === 'Files' && !isAtMobile) {
            setShowUploadCover(true);
            props.setCurrentSidebar('upload');
        }
    };
    onmouseout = (e) => {
        const from = e.relatedTarget || e.toElement;
        if (!from || from.nodeName == 'HTML') {
            setShowUploadCover(false);
        }
    };

    // handlers: backgroundColor
    const [isChoosingBackColor, setIsChoosingBackColor] = React.useState(false);
    const [backColorChosen, setBackColorChosen] = React.useState({
        background: {
            r: '255',
            g: '255',
            b: '255',
            a: '1',
        },
    });
    const toggleBackColorSelection = (e) => {
        utils.trackOutSideClick(document.querySelector('.backgroundPicker'), () => {
            setIsChoosingBackColor(false);
            props.setIsFocusInput(false);
            props.canvas.fire('object:modified');
        });
        setIsChoosingBackColor(true);
        props.setIsFocusInput(true);
    };
    const backgroundColorHandler = (color) => {
        props.canvas.backgroundImage = 0;
        props.canvas.backgroundColor = color;
    };
    const handleBackColorChange = (color) => {
        const colorRgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
        setBackColorChosen({ background: colorRgba });
        backgroundColorHandler(colorRgba);
    };
    const handleBackColorChangeCube = (e) => {
        let color;
        if (e.target.classList.contains('nonColor')) {
            color = 'rgba(255, 255, 255, 1)';
            document.querySelector('.currentColorCube').classList.add('nonColor');
        } else {
            if (document.querySelector('.currentColorCube')) {
                document.querySelector('.currentColorCube').classList.remove('nonColor');
            }
            color = e.target.style.backgroundColor;
        }
        setBackColorChosen({ background: color });
        backgroundColorHandler(color);
        props.canvas.fire('object:modified');
        props.canvas.requestRenderAll();
    };

    // get current image styles
    const [currentFilters, setCurrentFilters] = React.useState({
        ...config.imageFiltersInit,
    });
    React.useEffect(() => {
        if (props.activeObj.type === 'image') {
            props.activeObj.filters.forEach((item) => {
                const type = item.type.toLowerCase();
                type === 'huerotation'
                    ? (config.imageFiltersInit.rotation = parseFloat(item.rotation))
                    : (config.imageFiltersInit[type] = parseFloat(item[type]));
            });
            setCurrentFilters(config.imageFiltersInit);
        }
    }, [props.activeObj]);
    const resetFilters = () => {
        setCurrentFilters({
            ...config.imageFiltersInit,
        });
        props.activeObj.filters = [];
        props.activeObj.applyFilters();
        props.canvas.requestRenderAll();
    };

    // jsx : sidebar
    const sidebarFoldJsx = config.sidebarArray.map((item, index) => (
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
    // jsx: sidebar - text
    const textJsx = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldText'
            style={{ display: props.currentSidebar === 'text' ? 'flex' : 'none' }}
            onMouseDown={(e) => props.saveDragItem.func(e)}
        >
            {config.textSetting.map((option, index) => (
                <div
                    key={option.className}
                    draggable={!isAtMobile}
                    className={`unfoldItem ${option.className}`}
                    onClick={() => {
                        utils.addIText(
                            nextAddPosition,
                            props.canvas,
                            props.canvasSetting,
                            adjSetNextPosition,
                            index
                        );
                    }}
                >
                    {option.content}
                </div>
            ))}
        </div>
    );
    // jsx: sidebar - shape
    const normalShapeJsx = config.normalShapeSetting.map((option) => (
        <img
            key={option.type}
            src={sidebarItems[option.type]}
            className={`unfoldItem ${option.className}`}
            draggable={!isAtMobile}
            onClick={() => {
                utils[option.callbackName](nextAddPosition, props.canvas, props.canvasSetting);
                adjSetNextPosition();
            }}
        ></img>
    ));
    const shapeJsx = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldShape'
            onMouseDown={(e) => props.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'shape' ? 'flex' : 'none' }}
        >
            <div className='sidebarUnfoldSubtitle'>常用形狀</div>
            {normalShapeJsx}
            <div className='sidebarUnfoldSubtitle'>不規則形狀</div>
            {config.abnormalShapeArray.map((item, index) => {
                return (
                    <img
                        key={index}
                        src={item}
                        draggable={!isAtMobile}
                        className='unfoldItem abnormalShape'
                        onClick={(e) => {
                            utils.addShape(e.target.src, nextAddPosition, props.canvas, props.canvasSetting);
                            adjSetNextPosition();
                        }}
                    ></img>
                );
            })}
        </div>
    );
    // jsx: sidebar - line
    const lineJsx = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldLine'
            onMouseDown={(e) => props.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'line' ? 'flex' : 'none' }}
        >
            {config.lineArray.map((item, index) => {
                return (
                    <img
                        key={index}
                        src={item}
                        className='unfoldItem itemLine'
                        onClick={(e) => {
                            utils.addShape(e.target.src, nextAddPosition, props.canvas, props.canvasSetting);
                            adjSetNextPosition();
                        }}
                        draggable={!isAtMobile}
                    ></img>
                );
            })}
        </div>
    );
    // jsx: sidebar - image
    const imageJsx = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldImg'
            onMouseDown={(e) => props.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'image' ? 'flex' : 'none' }}
        >
            {config.imageArray.map((category, index) => {
                return (
                    <div className='unfoldImgWrapper unfoldImgWrapperToggle' key={index}>
                        <div className='toggleSubtitle'>
                            {category.title}
                            <div
                                onClick={(e) => {
                                    e.target.parentNode.parentNode.classList.toggle('unfoldImgWrapperToggle');
                                    e.target.textContent === '+'
                                        ? (e.target.textContent = '-')
                                        : (e.target.textContent = '+');
                                }}
                                className='toggleButton'
                            >
                                +
                            </div>
                        </div>
                        {category.src.map((item, index) => {
                            return (
                                <div key={index} className='unfoldItemGalleryWrapper'>
                                    <img
                                        onClick={(e) => {
                                            utils.addImage(
                                                e.target,
                                                nextAddPosition,
                                                props.canvas,
                                                props.canvasSetting
                                            );
                                            adjSetNextPosition();
                                        }}
                                        className='unfoldItem unfoldItemGallery'
                                        draggable={!isAtMobile}
                                        src={item}
                                        onLoad={(e) => {
                                            e.target.naturalHeight > e.target.naturalWidth
                                                ? (e.target.parentNode.style.width = '29%')
                                                : (e.target.parentNode.style.width = '58%');
                                        }}
                                    ></img>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
    // jsx: sidebar - sticker
    const stickerJsx = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldSticker'
            onMouseDown={(e) => props.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'sticker' ? 'flex' : 'none' }}
        >
            {config.stickerTestArray.map((category, index) => {
                return (
                    <div
                        className='unfoldImgWrapper unfoldImgWrapperToggle'
                        key={index}
                        style={{ width: isAtMobile ? 'auto' : '' }}
                    >
                        <div className='toggleSubtitle'>
                            {category.title}
                            <div
                                onClick={(e) => {
                                    e.target.parentNode.parentNode.classList.toggle('unfoldImgWrapperToggle');
                                    e.target.textContent === '+'
                                        ? (e.target.textContent = '-')
                                        : (e.target.textContent = '+');
                                }}
                                className='toggleButton'
                            >
                                +
                            </div>
                        </div>
                        {category.src.map((item, index) => {
                            return (
                                <div key={index} className='unfoldItemGalleryWrapper'>
                                    <img
                                        onClick={(e) => {
                                            utils.addSticker(
                                                e.target,
                                                nextAddPosition,
                                                props.canvas,
                                                props.canvasSetting,
                                                adjSetNextPosition
                                            );
                                        }}
                                        className='unfoldItem unfoldItemGallery'
                                        draggable={!isAtMobile}
                                        src={item}
                                        onLoad={(e) => {
                                            if (e.target.naturalHeight > e.target.naturalWidth) {
                                                e.target.parentNode.style.width = '20%';
                                            } else {
                                                e.target.parentNode.style.width = '40%';
                                            }
                                        }}
                                    ></img>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
    // jsx: sidebar - background color cube
    const backgroundColorJsx = config.backgroundColorArray.map((item, index) => {
        return (
            <div
                key={index}
                className='backgroundColorCube'
                style={{ backgroundColor: item }}
                onClick={handleBackColorChangeCube}
            ></div>
        );
    });
    // jsx: sidebar - background image
    const backgroundImageJsx = config.backgroundImageArray.map((item, index) => {
        return (
            <div key={index} className='unfoldItemGalleryWrapper'>
                <img
                    key={index}
                    draggable='false'
                    onClick={(e) => utils.backgroundImageHandler(e.target, props.canvas, props.canvasSetting)}
                    className='unfoldItem unfoldItemGallery'
                    style={{ position: 'relative', height: isAtMobile ? '100%' : '10rem' }}
                    src={item}
                    onLoad={(e) => {
                        e.target.naturalHeight > e.target.naturalWidth
                            ? (e.target.parentNode.style.width = '29%')
                            : (e.target.parentNode.style.width = '58%');
                    }}
                ></img>
            </div>
        );
    });
    const backgroundJsxAll = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldBack'
            style={{ display: props.currentSidebar === 'background' ? 'flex' : 'none' }}
        >
            {isChoosingBackColor && (
                <ChromePicker
                    className='backgroundPicker'
                    color={backColorChosen.background}
                    onChange={(color) => {
                        handleBackColorChange(color);
                        props.canvas.requestRenderAll();
                    }}
                />
            )}
            <div className='unfoldImgWrapper '>
                <div className='toggleSubtitle'>背景色彩</div>
                <div className='currentBackground'>
                    <div
                        className={`backgroundColorCube currentColorCube ${
                            backColorChosen.background === 'rgba(255, 255, 255, 1)' ||
                            JSON.stringify(backColorChosen.background) ===
                                JSON.stringify({
                                    r: '255',
                                    g: '255',
                                    b: '255',
                                    a: '1',
                                })
                                ? 'nonColor'
                                : ''
                        }`}
                        style={{ backgroundColor: backColorChosen.background }}
                        onClick={toggleBackColorSelection}
                    ></div>
                </div>
                <div className='backgroundColorChart'>
                    <div className='backgroundColorCube nonColor' onClick={handleBackColorChangeCube}></div>
                    {backgroundColorJsx}
                </div>
            </div>
            <div className='unfoldImgWrapper' style={{ overflow: 'visible' }}>
                <div className='toggleSubtitle'>背景圖片</div>
                <div className='backImgChart'>{backgroundImageJsx}</div>
            </div>
        </div>
    );
    // jsx: sidebar - upload image
    const uploadedImgJsx = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldUpload'
            style={{ display: props.currentSidebar === 'upload' ? 'flex' : 'none' }}
        >
            {uploadProgressValue === 0 ? (
                <label className='unfoldItem uploadLabel'>
                    上傳圖片
                    <input
                        className='uploadInput'
                        type='file'
                        accept='image/png, image/jpeg'
                        onChange={handleUploadImage}
                    ></input>
                </label>
            ) : (
                <div className='progressWrapper'>
                    <progress className='uploadProgress' value={uploadProgressValue} max='100'></progress>
                    <div>LOADING</div>
                    <div>{uploadProgressValue}%</div>
                </div>
            )}
            {props.uploadedFiles &&
                props.uploadedFiles.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className='unfoldItemImgWrapper unfoldItemGalleryWrapper'
                            onMouseDown={(e) => props.saveDragItem.func(e)}
                        >
                            <img
                                className='unfoldItemImg unfoldItemGallery'
                                onClick={(e) => {
                                    utils.addImage(
                                        e.target,
                                        nextAddPosition,
                                        props.canvas,
                                        props.canvasSetting,
                                        adjSetNextPosition
                                    );
                                }}
                                draggable={!isAtMobile}
                                src={item.src}
                                onLoad={(e) => {
                                    e.target.naturalHeight > e.target.naturalWidth
                                        ? (e.target.parentNode.style.width = '29%')
                                        : (e.target.parentNode.style.width = '58%');
                                }}
                            ></img>
                            <div
                                className='close'
                                id={item.path}
                                onClick={(e) => {
                                    e.target.previousElementSibling.src = deleteLoading;
                                    e.target.previousElementSibling.style.height = '100%';
                                    firebase.removeUploadImg(e, props.fileId);
                                }}
                            >
                                x
                            </div>
                        </div>
                    );
                })}
            {showUploadCover && (
                <div className='uploadCover'>
                    <icons.CoverUpload className='uploadIcon' />
                    <div>拖曳以上傳檔案</div>
                    <span>您可以上傳jpg或png檔案</span>
                </div>
            )}
        </div>
    );
    // jsx: image adjustment
    const imageFiltersHandler = (e, item, index) => {
        const filters = fabric.Image.filters;
        const newFilters = { ...currentFilters };
        newFilters[item.attr] = parseFloat(e.target.value);
        setCurrentFilters(newFilters);
        const newFilter = new filters[item.way]({
            [item.attr]: parseFloat(e.target.value),
        });
        props.activeObj.filters[index] = newFilter;
        props.activeObj.applyFilters();
        props.canvas.requestRenderAll();
    };
    const imageFiltersJsx = (
        <div
            className='sidebarUnfoldInner unfoldImgAdjustment'
            style={{
                display: props.currentSidebar === 'imageAdjustment' ? 'flex' : 'none',
            }}
        >
            {config.imageFiltersSetting.map((item, index) => (
                <div key={index} className='imgAdjustBox'>
                    <div className='imgAdjustText'>{item.text}</div>
                    <input
                        className='imgAdjustRange'
                        type='range'
                        min={item.min}
                        max={item.max}
                        value={currentFilters[item.attr]}
                        onInput={(e) => imageFiltersHandler(e, item, index)}
                        step={item.step}
                    ></input>
                    <div className='imgAdjustValue'>{currentFilters[item.attr]}</div>
                </div>
            ))}
            <div className='resetFilterButton' onClick={resetFilters}>
                重設圖片
            </div>
        </div>
    );
    // jsx: sidebar - toggle button
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
            {showAlert && (
                <Alert
                    buttonNumber={alertSetting.buttonNumber}
                    buttonOneFunction={alertSetting.buttonOneFunction}
                    buttonTwoFunction={alertSetting.buttonTwoFunction}
                    buttonOneTitle={alertSetting.buttonOneTitle}
                    buttonTwoTitle={alertSetting.buttonTwoTitle}
                    title={alertSetting.title}
                    content={alertSetting.content}
                />
            )}
            <div className='sidebarFold'>
                {sidebarFoldJsx}
                <div className='ghostDiv'></div>
                <div className='ghostDiv'></div>
                <div className='ghostDiv'></div>
                <div className='ghostDiv'></div>
                <div className='ghostDiv'></div>
                <div className='ghostDiv'></div>
            </div>
            {props.currentSidebar !== '' && (
                <div
                    className={`sidebarUnfold sidebarUnfoldUpload ${
                        props.currentSidebar === 'text' ? 'firstUnfold' : ''
                    }`}
                >
                    {textJsx}
                    {shapeJsx}
                    {lineJsx}
                    {imageJsx}
                    {backgroundJsxAll}
                    {uploadedImgJsx}
                    {stickerJsx}
                    <Sample
                        canvas={props.canvas}
                        canvasSetting={props.canvasSetting}
                        currentSidebar={props.currentSidebar}
                        isAtMobile={isAtMobile}
                    />
                    {/* {sampleJsx} */}
                    {imageFiltersJsx}
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
