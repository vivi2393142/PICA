import React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';
import * as icons from '../../../img/icons';
import * as firebase from '../../../firebase';
import * as sidebarItems from '../../../img/sidebarItems';

const Sidebar = (props) => {
    const allSettings = props.allSettings;
    const mainColor = '#e89a4f';
    const [nextAddPosition, setNextAddPosition] = React.useState({ top: 10, left: 10 });
    const [uploadProgressValue, setUploadProgressValue] = React.useState(0);
    const [sampleList, setSampleList] = React.useState([]);
    const [showUploadCover, setShowUploadCover] = React.useState(false);

    // set next add in component position
    const adjSetNextPosition = () => {
        if (
            nextAddPosition.left + 80 > allSettings.canvasSetting.width / 2 ||
            nextAddPosition.top + 80 > allSettings.canvasSetting.height / 2
        ) {
            setNextAddPosition({ top: 10, left: 10 });
        } else {
            setNextAddPosition({ top: nextAddPosition.top + 10, left: nextAddPosition.left + 10 });
        }
    };
    // add new components: rectangle, circle, triangle, text, image, background
    const addRect = () => {
        const shapeRatio = allSettings.canvas.width / 600;
        const rect = new fabric.Rect({
            top: nextAddPosition.top,
            left: nextAddPosition.left,
            height: 100 * shapeRatio,
            width: 100 * shapeRatio,
            fill: mainColor,
            objectCaching: false,
        });
        allSettings.canvas.add(rect);
        allSettings.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addRadiusRect = () => {
        const shapeRatio = allSettings.canvas.width / 600;
        const rect = new fabric.Rect({
            top: nextAddPosition.top,
            left: nextAddPosition.left,
            height: 100 * shapeRatio,
            width: 100 * shapeRatio,
            fill: mainColor,
            objectCaching: false,
            rx: 15,
            ry: 15,
        });
        allSettings.canvas.add(rect);
        allSettings.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addCircle = () => {
        const shapeRatio = allSettings.canvas.width / 600;
        const circle = new fabric.Circle({
            top: nextAddPosition.top,
            left: nextAddPosition.left,
            radius: 50 * shapeRatio,
            fill: mainColor,
        });
        allSettings.canvas.add(circle);
        allSettings.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addTriangle = () => {
        const shapeRatio = allSettings.canvas.width / 600;
        const triangle = new fabric.Triangle({
            top: nextAddPosition.top,
            left: nextAddPosition.left,
            width: 100 * shapeRatio,
            height: 100 * shapeRatio,
            fill: mainColor,
        });
        allSettings.canvas.add(triangle);
        allSettings.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addShape = (e) => {
        const shapeRatio = allSettings.canvas.width / 600;
        fabric.loadSVGFromURL(e.target.src, (objects, options) => {
            const newShape = fabric.util.groupSVGElements(objects, options);
            newShape.set({
                top: nextAddPosition.top,
                left: nextAddPosition.left,
                scaleX: 2.2 * shapeRatio,
                scaleY: 2.2 * shapeRatio,
            });
            // newShape.toObject = (function (toObject) {
            //     return function (propertiesToInclude) {
            //         return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
            //             specialType: 'shape', //my custom property
            //         });
            //     };
            // })(newShape.toObject);
            allSettings.canvas.add(newShape);
            allSettings.canvas.requestRenderAll();
            adjSetNextPosition();
        });
    };
    const addIText = (title, size, weight) => {
        const textRatio = allSettings.canvas.width / 600;
        let text = new fabric.IText(title, {});
        text.set({
            top: nextAddPosition.top,
            left: nextAddPosition.left,
            fill: '#555555',
            fontSize: size * textRatio,
            fontFamily: 'Sans-serif',
            fontWeight: weight,
        });
        allSettings.canvas.add(text);
        text.setControlsVisibility({
            mb: false,
            mt: false,
            ml: false,
            mr: false,
        });
        allSettings.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addImage = (e) => {
        const scaleRatio = Math.max(
            allSettings.canvas.width / 4 / e.target.naturalWidth,
            allSettings.canvas.height / 4 / e.target.naturalHeight
        );
        fabric.Image.fromURL(
            e.target.src,
            (img) => {
                const oImg = img.set({
                    top: nextAddPosition.top,
                    left: nextAddPosition.left,
                    scaleX: scaleRatio,
                    scaleY: scaleRatio,
                });
                allSettings.canvas.add(oImg);
                oImg.setControlsVisibility({
                    mb: false,
                    mt: false,
                    ml: false,
                    mr: false,
                });
            },
            {
                crossOrigin: 'anonymous',
            }
        );
        allSettings.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addSticker = (e) => {
        const scaleRatio = Math.max(
            allSettings.canvas.width / 4 / e.target.naturalWidth,
            allSettings.canvas.height / 4 / e.target.naturalHeight
        );
        fabric.Image.fromURL(
            e.target.src,
            (img) => {
                const oImg = img.set({
                    top: nextAddPosition.top,
                    left: nextAddPosition.left,
                    scaleX: scaleRatio,
                    scaleY: scaleRatio,
                });
                oImg.toObject = (function (toObject) {
                    return function (propertiesToInclude) {
                        return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
                            specialType: 'sticker', //my custom property
                        });
                    };
                })(oImg.toObject);
                allSettings.canvas.add(oImg);
                oImg.setControlsVisibility({
                    mb: false,
                    mt: false,
                    ml: false,
                    mr: false,
                });
            },
            {
                crossOrigin: 'anonymous',
            }
        );
        allSettings.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const backgroundColorHandler = (color) => {
        allSettings.canvas.backgroundImage = 0;
        allSettings.canvas.backgroundColor = color;
        allSettings.canvas.requestRenderAll();
    };
    const backgroundImageHandler = (e) => {
        allSettings.canvas.offHistory();
        // remove exist background
        if (allSettings.canvas.getObjects().length > 0) {
            if (allSettings.canvas.getObjects()[0].specialType === 'background') {
                allSettings.canvas.remove(allSettings.canvas.getObjects()[0]);
            }
        }
        const scaleToWidth = allSettings.canvasSetting.width / e.target.naturalWidth;
        const scaleToHeight = allSettings.canvasSetting.height / e.target.naturalHeight;
        const scaleWay = scaleToWidth > scaleToHeight ? 'toWidth' : 'toHeight';
        allSettings.canvas.onHistory();
        fabric.Image.fromURL(
            e.target.src,
            (img) => {
                const backImg = img.set({
                    // fit canvas
                    scaleX: scaleWay === 'toWidth' ? scaleToWidth : scaleToHeight,
                    scaleY: scaleWay === 'toWidth' ? scaleToWidth : scaleToHeight,
                });
                allSettings.presetBackgroundImg(
                    backImg,
                    allSettings.canvas,
                    allSettings.canvasSetting,
                    scaleWay,
                    scaleToWidth,
                    scaleToHeight
                );
            },
            {
                crossOrigin: 'anonymous',
            }
        );
    };

    // handlers: uploaded function
    const handleUploadImage = (e) => {
        if (e.target.files[0].size > 5242880) {
            alert('請勿上傳超過5mb之圖片');
        } else {
            firebase.uploadToStorage(
                e.target.files,
                props.fileId,
                (uploadValue) => setUploadProgressValue(uploadValue),
                () => setUploadProgressValue(0)
            );
        }
    };
    // handlers: drop to upload
    const dragoverHandler = (e) => {
        e.preventDefault();
    };
    const dropHandler = (e) => {
        e.preventDefault();
        setShowUploadCover(false);
        // prevent canvas drop event
        if (e.dataTransfer.files.length > 0) {
            const files = e.dataTransfer.files;
            if (e.dataTransfer.files.length > 1) {
                alert('上傳錯誤，一次限上傳一張圖片');
            } else if (files[0].size > 5242880) {
                alert('上傳錯誤，請勿上傳超過5mb之圖片');
            } else if (
                e.dataTransfer.files[0].type !== 'image/png' &&
                e.dataTransfer.files[0].type !== 'image/jpeg'
            ) {
                alert('上傳錯誤，請上傳jpeg或png格式檔案');
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
    const dragEnterHandler = (e) => {
        if (e.dataTransfer.types[0] === 'Files') {
            setShowUploadCover(true);
            props.setCurrentSidebar('upload');
        }
    };
    React.useEffect(() => {
        // let start = false;
        document.addEventListener('dragover', dragoverHandler);
        document.addEventListener('drop', dropHandler);
        document.addEventListener('dragenter', dragEnterHandler);
        return () => {
            document.removeEventListener('dragover', dragoverHandler);
            document.removeEventListener('drop', dropHandler);
            document.removeEventListener('dragenter', dragEnterHandler);
        };
    }, []);
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
        const clickedOrNot = (e) => {
            if (!document.querySelector('.backgroundPicker').contains(e.target)) {
                setIsChoosingBackColor(false);
                allSettings.canvas.fire('object:modified');
                document.removeEventListener('click', clickedOrNot, true);
            }
        };
        document.addEventListener('click', clickedOrNot, true);
        setIsChoosingBackColor(true);
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
        allSettings.canvas.requestRenderAll();
    };
    // handlers: use template
    const handleTemplateUse = (e) => {
        alert('請注意，套用範本將自動刪除現存在在畫布上的所有物件');
        firebase.getSingleSample(e.target.id, (data) => {
            allSettings.canvas.loadFromJSON(data);
        });
    };
    // handler: img adjustment
    // get current image styles
    React.useEffect(() => {
        if (allSettings.activeObj.type === 'image') {
            let filtersActive = {
                brightness: 0,
                contrast: 0,
                saturation: 0,
                rotation: 0,
                blur: 0,
                noise: 0,
            };
            allSettings.activeObj.filters.forEach((item) => {
                let type = item.type.toLowerCase();
                if (type === 'huerotation') {
                    filtersActive.rotation = parseFloat(item.rotation);
                } else {
                    filtersActive[type] = parseFloat(item[type]);
                }
            });
            setCurrentFilters(filtersActive);
        }
    }, [allSettings.activeObj]);
    const [currentFilters, setCurrentFilters] = React.useState({
        brightness: 0,
        contrast: 0,
        saturation: 0,
        rotation: 0,
        blur: 0,
        noise: 0,
    });
    const customFilters = [
        {
            way: 'Brightness',
            attr: 'brightness',
            max: 1,
            min: -1,
            step: 0.01,
            text: '亮度',
            rate: 100,
        },
        {
            way: 'Contrast',
            attr: 'contrast',
            max: 1,
            min: -1,
            step: 0.01,
            text: '對比度',
            rate: 100,
        },
        {
            way: 'Saturation',
            attr: 'saturation',
            max: 1,
            min: -1,
            step: 0.01,
            text: '飽和度',
            rate: 100,
        },
        {
            way: 'HueRotation',
            attr: 'rotation',
            max: 1,
            min: -1,
            step: 0.01,
            text: '色調',
            rate: 100,
        },
        {
            way: 'Blur',
            attr: 'blur',
            max: 1,
            min: 0,
            step: 0.01,
            text: '模糊',
            rate: 100,
        },
        {
            way: 'Noise',
            attr: 'noise',
            max: 1000,
            min: 0,
            step: 10,
            text: '雜訊',
            rate: 0.1,
        },
    ];
    const resetFilters = () => {
        setCurrentFilters({
            brightness: 0,
            contrast: 0,
            saturation: 0,
            rotation: 0,
            blur: 0,
            noise: 0,
        });
        allSettings.activeObj.filters = [];
        allSettings.activeObj.applyFilters();
        allSettings.canvas.requestRenderAll();
    };
    // TODO: 測試用資料，待刪除
    const logCurrentCanvas = () => {
        var json = allSettings.canvas.toJSON();
        console.log(JSON.stringify(json));
    };

    // jsx : sidebar
    const sidebarArray = [
        {
            EN: 'template',
            CH: '範本',
            icon: <icons.SidebarSample className='sidebarIcon' />,
            iconB: <icons.SidebarSampleB className='sidebarIcon' />,
        },
        {
            EN: 'text',
            CH: '文字',
            icon: <icons.SidebarText className='sidebarIcon' />,
            iconB: <icons.SidebarTextB className='sidebarIcon' />,
        },
        {
            EN: 'shape',
            CH: '形狀',
            icon: <icons.SidebarShape className='sidebarIcon' />,
            iconB: <icons.SidebarShapeB className='sidebarIcon' />,
        },
        {
            EN: 'line',
            CH: '線條',
            icon: <icons.SidebarLine className='sidebarIcon' />,
            iconB: <icons.SidebarLineB className='sidebarIcon' />,
        },
        {
            EN: 'image',
            CH: '照片',
            icon: <icons.SidebarImage className='sidebarIcon' />,
            iconB: <icons.SidebarImageB className='sidebarIcon' />,
        },
        {
            EN: 'sticker',
            CH: '貼圖',
            icon: <icons.SidebarSticker className='sidebarIcon' />,
            iconB: <icons.SidebarStickerB className='sidebarIcon' />,
        },
        {
            EN: 'background',
            CH: '背景',
            icon: <icons.SidebarBackground className='sidebarIcon' />,
            iconB: <icons.SidebarBackgroundB className='sidebarIcon' />,
        },

        {
            EN: 'upload',
            CH: '上傳',
            icon: <icons.SidebarUpload className='sidebarIcon' />,
            iconB: <icons.SidebarUploadB className='sidebarIcon' />,
        },
        // {
        //     EN: 'more',
        //     CH: '更多',
        //     icon: <icons.SidebarMore className='sidebarIcon' />,
        //     iconB: <icons.SidebarMoreB className='sidebarIcon' />,
        // },
    ];
    const sidebarFoldJsx = sidebarArray.map((item, index) => (
        <div
            key={index}
            className={`sideButton ${
                props.currentSidebar === 'template' && props.currentSidebar === item.EN
                    ? 'sideButtonChosen firstButton'
                    : props.currentSidebar === 'upload' && props.currentSidebar === item.EN
                    ? 'sideButtonChosen lastButton'
                    : props.currentSidebar === item.EN
                    ? 'sideButtonChosen'
                    : ''
            }`}
            onClick={() => {
                props.setCurrentSidebar(item.EN);
            }}
        >
            {props.currentSidebar === item.EN ? item.icon : item.iconB}
            <div className={`iconText ${props.currentSidebar === item.EN ? 'iconTextB' : ''}`}>
                {item.CH}
            </div>
        </div>
    ));
    // jsx: sidebar - sample
    React.useEffect(() => {
        if (props.allSettings.canvasSetting.type) {
            firebase.getSampleList(props.allSettings.canvasSetting.type, (result) => {
                setSampleList(result);
            });
        }
    }, [props.allSettings.canvasSetting]);
    const sampleJsx = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldSample'
            style={{ display: props.currentSidebar === 'template' ? 'flex' : 'none' }}
        >
            {sampleList.map((item, index) => {
                return (
                    <div
                        key={index}
                        className='unfoldItemGalleryWrapper'
                        style={{ width: '45%', overflow: 'visible', height: 'auto' }}
                    >
                        <img
                            key={index}
                            draggable='false'
                            onClick={handleTemplateUse}
                            className='unfoldItem unfoldItemGallery'
                            src={item.snapshot}
                            id={item.basicSetting.id}
                            style={{
                                position: 'relative',
                                top: 0,
                                left: 0,
                                transform: 'translate(0, 0)',
                            }}
                        ></img>
                    </div>
                );
            })}
        </div>
    );
    // jsx: sidebar - text
    const textJsx = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldText'
            style={{ display: props.currentSidebar === 'text' ? 'flex' : 'none' }}
            onMouseDown={(e) => allSettings.saveDragItem.func(e)}
        >
            <div
                draggable='true'
                className='unfoldItem addTextBig '
                onClick={() =>
                    addIText(
                        allSettings.textSetting[0].title,
                        allSettings.textSetting[0].size,
                        allSettings.textSetting[0].fontWeight
                    )
                }
            >
                新增標題
            </div>
            <div
                draggable='true'
                className='unfoldItem addTextMiddle '
                onClick={() =>
                    addIText(
                        allSettings.textSetting[1].title,
                        allSettings.textSetting[1].size,
                        allSettings.textSetting[1].fontWeight
                    )
                }
            >
                新增副標
            </div>
            <div
                draggable='true'
                className='unfoldItem addTextSmall '
                onClick={() =>
                    addIText(
                        allSettings.textSetting[2].title,
                        allSettings.textSetting[2].size,
                        allSettings.textSetting[2].fontWeight
                    )
                }
            >
                新增內文
            </div>
        </div>
    );
    // jsx: sidebar - shape
    const abnormalShapeArray = [
        sidebarItems.shape1,
        sidebarItems.shape2,
        sidebarItems.shape3,
        sidebarItems.shape4,
        sidebarItems.shape5,
        sidebarItems.shape6,
        sidebarItems.shape7,
        sidebarItems.shape8,
    ];
    const shapeJsx = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldShape'
            onMouseDown={(e) => allSettings.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'shape' ? 'flex' : 'none' }}
        >
            <div className='sidebarUnfoldSubtitle'>常用形狀</div>
            <img
                src={sidebarItems.square}
                className='unfoldItem rectShape '
                draggable='true'
                onClick={addRect}
            ></img>
            <img
                src={sidebarItems.radiusSquare}
                className='unfoldItem radiusRectShape '
                draggable='true'
                onClick={addRadiusRect}
            ></img>
            <img
                src={sidebarItems.circle}
                className='unfoldItem circleShape'
                draggable='true'
                onClick={addCircle}
            ></img>
            <img
                src={sidebarItems.triangle}
                className='unfoldItem triangleShape'
                draggable='true'
                onClick={addTriangle}
            ></img>
            <div className='sidebarUnfoldSubtitle'>不規則形狀</div>
            {abnormalShapeArray.map((item, index) => {
                return (
                    <img
                        key={index}
                        src={item}
                        draggable='true'
                        className='unfoldItem abnormalShape'
                        onClick={addShape}
                    ></img>
                );
            })}
        </div>
    );
    // jsx: sidebar - line
    const lineArray = [
        sidebarItems.line1,
        sidebarItems.line2,
        sidebarItems.line3,
        sidebarItems.line4,
        sidebarItems.line5,
        sidebarItems.line6,
        sidebarItems.line7,
        sidebarItems.line8,
        sidebarItems.line9,
        sidebarItems.line10,
        sidebarItems.line11,
    ];
    const lineJsx = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldLine'
            onMouseDown={(e) => allSettings.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'line' ? 'flex' : 'none' }}
        >
            {lineArray.map((item, index) => {
                return (
                    <img
                        key={index}
                        src={item}
                        className='unfoldItem itemLine'
                        onClick={addShape}
                        draggable='true'
                    ></img>
                );
            })}
        </div>
    );
    // jsx: sidebar - image
    const imageArray = [
        {
            title: '聖誕節',
            src: [
                sidebarItems.IX01,
                sidebarItems.IX02,
                sidebarItems.IX03,
                sidebarItems.IX04,
                sidebarItems.IX05,
                sidebarItems.IX06,
            ],
        },
        {
            title: '生活',
            src: [
                sidebarItems.IL01,
                sidebarItems.IL02,
                sidebarItems.IL03,
                sidebarItems.IL04,
                sidebarItems.IL05,
                sidebarItems.IL06,
            ],
        },
        {
            title: '餐食',
            src: [sidebarItems.IM01, sidebarItems.IM02, sidebarItems.IM03, sidebarItems.IM04],
        },
        {
            title: '其他',
            src: [
                sidebarItems.IO01,
                sidebarItems.IO02,
                sidebarItems.IO03,
                sidebarItems.IO04,
                sidebarItems.IO05,
            ],
        },
    ];
    const imageJsx = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldImg'
            onMouseDown={(e) => allSettings.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'image' ? 'flex' : 'none' }}
        >
            {imageArray.map((category, index) => {
                return (
                    <div className='unfoldImgWrapper unfoldImgWrapperToggle' key={index}>
                        <div className='toggleSubtitle'>
                            {category.title}
                            <div
                                onClick={(e) => {
                                    e.target.parentNode.parentNode.classList.toggle(
                                        'unfoldImgWrapperToggle'
                                    );
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
                                        onClick={addImage}
                                        className='unfoldItem unfoldItemGallery'
                                        draggable='true'
                                        src={item}
                                        onLoad={(e) => {
                                            if (e.target.naturalHeight > e.target.naturalWidth) {
                                                e.target.parentNode.style.width = '29%';
                                            } else {
                                                e.target.parentNode.style.width = '58%';
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

    // jsx: sidebar - sticker
    const stickerTestArray = [
        {
            title: '紙膠帶',
            src: [sidebarItems.ST01, sidebarItems.ST02, sidebarItems.ST03, sidebarItems.ST04],
        },
        {
            title: '太空',
            src: [
                sidebarItems.SPO01,
                sidebarItems.SPO02,
                sidebarItems.SPO03,
                sidebarItems.SPO04,
                sidebarItems.SPO05,
                sidebarItems.SPO06,
            ],
        },
        {
            title: '怪獸',
            src: [
                sidebarItems.SD01,
                sidebarItems.SD02,
                sidebarItems.SD03,
                sidebarItems.SD04,
                sidebarItems.SD05,
                sidebarItems.SD06,
            ],
        },
        {
            title: '肉食主義',
            src: [sidebarItems.SM01, sidebarItems.SM02, sidebarItems.SM03, sidebarItems.SM04],
        },
        {
            title: '健康蔬食',
            src: [
                sidebarItems.SFU01,
                sidebarItems.SFU02,
                sidebarItems.SFU03,
                sidebarItems.SFU04,
                sidebarItems.SFU05,
                sidebarItems.SFU06,
            ],
        },
        {
            title: '花朵',
            src: [
                sidebarItems.SF01,
                sidebarItems.SF02,
                sidebarItems.SF03,
                sidebarItems.SF04,
                sidebarItems.SF05,
                sidebarItems.SF06,
                sidebarItems.SF07,
                sidebarItems.SF08,
            ],
        },
        {
            title: '恐龍',
            src: [
                sidebarItems.SMO01,
                sidebarItems.SMO02,
                sidebarItems.SMO03,
                sidebarItems.SMO04,
                sidebarItems.SMO05,
                sidebarItems.SMO06,
            ],
        },
    ];
    const stickerJsx = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldSticker'
            onMouseDown={(e) => allSettings.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'sticker' ? 'flex' : 'none' }}
        >
            {stickerTestArray.map((category, index) => {
                return (
                    <div className='unfoldImgWrapper unfoldImgWrapperToggle' key={index}>
                        <div className='toggleSubtitle'>
                            {category.title}
                            <div
                                onClick={(e) => {
                                    e.target.parentNode.parentNode.classList.toggle(
                                        'unfoldImgWrapperToggle'
                                    );
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
                                        onClick={addSticker}
                                        className='unfoldItem unfoldItemGallery'
                                        draggable='true'
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
    const colorArray = [
        '#FCB900',
        '#FF6900',
        '#7BDCB5',
        '#8ED1FC',
        '#0693E3',
        '#ABB8C3',
        '#EB144C',
        '#F78DA7',
        '#9900EF',
    ];
    const backgroundColorJsx = colorArray.map((item, index) => {
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
    const backgroundImageArray = [
        sidebarItems.B01,
        sidebarItems.B02,
        sidebarItems.B03,
        sidebarItems.B04,
        sidebarItems.B05,
        sidebarItems.B06,
        sidebarItems.B07,
        sidebarItems.B08,
        sidebarItems.B09,
        sidebarItems.B10,
        sidebarItems.B11,
    ];
    const backgroundImageJsx = backgroundImageArray.map((item, index) => {
        return (
            <div key={index} className='unfoldItemGalleryWrapper'>
                <img
                    key={index}
                    draggable='false'
                    onClick={backgroundImageHandler}
                    className='unfoldItem unfoldItemGallery'
                    style={{ position: 'relative', height: '10rem' }}
                    src={item}
                    onLoad={(e) => {
                        if (e.target.naturalHeight > e.target.naturalWidth) {
                            e.target.parentNode.style.width = '29%';
                        } else {
                            e.target.parentNode.style.width = '58%';
                        }
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
                    onChange={handleBackColorChange}
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
                    <div
                        className='backgroundColorCube nonColor'
                        onClick={handleBackColorChangeCube}
                    ></div>
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
                    <progress
                        className='uploadProgress'
                        value={uploadProgressValue}
                        max='100'
                    ></progress>
                    <div>LOADING</div>
                    <div>{uploadProgressValue}%</div>
                </div>
            )}
            {allSettings.uploadedFiles &&
                allSettings.uploadedFiles.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className='unfoldItemImgWrapper unfoldItemGalleryWrapper'
                            onMouseDown={(e) => allSettings.saveDragItem.func(e)}
                        >
                            <img
                                className='unfoldItemImg unfoldItemGallery'
                                onClick={addImage}
                                draggable='true'
                                src={item.src}
                                onLoad={(e) => {
                                    if (e.target.naturalHeight > e.target.naturalWidth) {
                                        e.target.parentNode.style.width = '29%';
                                    } else {
                                        e.target.parentNode.style.width = '58%';
                                    }
                                }}
                            ></img>
                            <div
                                className='close'
                                id={item.path}
                                onClick={(e) => firebase.removeUploadImg(e, props.fileId)}
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
    const imageFiltersJsx = (
        <div
            className='sidebarUnfoldInner unfoldImgAdjustment'
            style={{
                display: props.currentSidebar === 'imageAdjustment' ? 'flex' : 'none',
            }}
        >
            {customFilters.map((item, index) => (
                <div key={index} className='imgAdjustBox'>
                    <div className='imgAdjustText'>{item.text}</div>
                    <input
                        className='imgAdjustRange'
                        type='range'
                        min={item.min}
                        max={item.max}
                        value={currentFilters[item.attr]}
                        onInput={(e) => {
                            let f = fabric.Image.filters;
                            let newFilters = { ...currentFilters };
                            newFilters[item.attr] = parseFloat(e.target.value);
                            setCurrentFilters(newFilters);
                            const newFilter = new f[item.way]({
                                [item.attr]: parseFloat(e.target.value),
                            });
                            allSettings.activeObj.filters[index] = newFilter;
                            allSettings.activeObj.applyFilters();
                            allSettings.canvas.requestRenderAll();
                        }}
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
        <div className='sidebar'>
            <div className='sidebarFold'>{sidebarFoldJsx}</div>
            {props.currentSidebar !== '' && (
                <div
                    className={`sidebarUnfold sidebarUnfoldUpload ${
                        props.currentSidebar === 'template' && 'firstUnfold'
                    }`}
                >
                    {textJsx}
                    {shapeJsx}
                    {lineJsx}
                    {imageJsx}
                    {backgroundJsxAll}
                    {uploadedImgJsx}
                    {stickerJsx}
                    {sampleJsx}
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
    trackOutSideClick: PropTypes.func.isRequired,
    allSettings: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    fileId: PropTypes.string.isRequired,
};

export default Sidebar;
