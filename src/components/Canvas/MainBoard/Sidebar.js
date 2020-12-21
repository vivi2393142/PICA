import React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';
import * as icons from '../../../img/icons';
import * as firebase from '../../../firebase';
import shape1 from '../../../img/src/sidebarItems/shape1.svg';
import shape2 from '../../../img/src/sidebarItems/shape2.svg';
import shape3 from '../../../img/src/sidebarItems/shape3.svg';
import shape4 from '../../../img/src/sidebarItems/shape4.svg';
import shape5 from '../../../img/src/sidebarItems/shape5.svg';
import shape6 from '../../../img/src/sidebarItems/shape6.svg';
import shape7 from '../../../img/src/sidebarItems/shape7.svg';
import shape8 from '../../../img/src/sidebarItems/shape8.svg';
import line1 from '../../../img/src/sidebarItems/line1.svg';
import line2 from '../../../img/src/sidebarItems/line2.svg';
import line3 from '../../../img/src/sidebarItems/line3.svg';
import line4 from '../../../img/src/sidebarItems/line4.svg';
import line5 from '../../../img/src/sidebarItems/line5.svg';
import line6 from '../../../img/src/sidebarItems/line6.svg';
import line7 from '../../../img/src/sidebarItems/line7.svg';
import line8 from '../../../img/src/sidebarItems/line8.svg';
import line9 from '../../../img/src/sidebarItems/line9.svg';
import line10 from '../../../img/src/sidebarItems/line10.svg';
import line11 from '../../../img/src/sidebarItems/line11.svg';
import square from '../../../img/src/sidebarItems/square.svg';
import radiusSquare from '../../../img/src/sidebarItems/radiusSquare.svg';
import triangle from '../../../img/src/sidebarItems/triangle.svg';
import circle from '../../../img/src/sidebarItems/circle.svg';

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
        // document.addEventListener('dragstart', dragStartHandler);
        // document.addEventListener('dragstart', )
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
            // allSettings.canvas.fire('object:modified');
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
    const abnormalShapeArray = [shape1, shape2, shape3, shape4, shape5, shape6, shape7, shape8];
    const shapeJsx = (
        <div
            className='sidebarUnfoldInner sidebarUnfoldShape'
            onMouseDown={(e) => allSettings.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'shape' ? 'flex' : 'none' }}
        >
            <div className='sidebarUnfoldSubtitle'>常用形狀</div>
            <img
                src={square}
                className='unfoldItem rectShape '
                draggable='true'
                onClick={addRect}
            ></img>
            <img
                src={radiusSquare}
                className='unfoldItem radiusRectShape '
                draggable='true'
                onClick={addRadiusRect}
            ></img>
            <img
                src={circle}
                className='unfoldItem circleShape'
                draggable='true'
                onClick={addCircle}
            ></img>
            <img
                src={triangle}
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
        line1,
        line2,
        line3,
        line4,
        line5,
        line6,
        line7,
        line8,
        line9,
        line10,
        line11,
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
        // {
        //     title: '聖誕節',
        //     src: [
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fxmas%2Fpexels-any-lane-5727921.jpeg?alt=media&token=648ea823-93a8-4710-b52f-065ee609fe1e',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fxmas%2Fpexels-any-lane-5727922.jpeg?alt=media&token=98f0bbb9-f006-4ae2-95ea-01943771242e',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fxmas%2Fpexels-giftpunditscom-1303098.jpeg?alt=media&token=e0b39787-7391-4edf-bf8c-3b12d60a78a4',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fxmas%2Fpexels-maksim-goncharenok-5821029.jpeg?alt=media&token=88099ca2-07f1-401d-9dc0-5f9dbe499461',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fxmas%2Fpexels-pixabay-235970.jpeg?alt=media&token=948a2516-9851-4261-9b81-eec3ff1e2e1a',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fxmas%2Fpexels-tejas-prajapati-586744.jpeg?alt=media&token=168a483f-d24e-4e35-853d-0112f5576cd0',
        //     ],
        // },
        // {
        //     title: '生活',
        //     src: [
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Flife%2FPhoto-by-%C2%A0%C4%90a%CC%A3%CC%86ngThanhTu%CC%81-from-Pexels.jpeg?alt=media&token=722e0e3f-fdc9-4f65-8e04-34aeb8421e4a',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Flife%2Fpexels-daria-shevtsova-2110449.jpeg?alt=media&token=6709e3fe-ff93-48ca-89a6-6f734e9c6961',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Flife%2Fpexels-julia-kuzenkov-2996261.jpeg?alt=media&token=c639867c-a4d9-4ed7-b36a-0a1a53c879b5',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Flife%2Fpexels-maksim-goncharenok-5605060.jpeg?alt=media&token=8352dde7-c624-439a-990c-f16ed0327f51',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Flife%2Fpexels-polina-tankilevitch-6030206.jpeg?alt=media&token=a5c0c2ad-d263-4c7a-a452-8ccb9a307b1f',
        //     ],
        // },
        // {
        //     title: '餐食',
        //     src: [
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fmeal%2Fpexels-daniela-constantini-5720777.jpeg?alt=media&token=5298aa72-410a-4d49-b59e-94708173bdb9',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fmeal%2Fpexels-daria-shevtsova-5882513.jpeg?alt=media&token=f483e4ca-79f4-40d9-9f8a-56731f48a38b',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fmeal%2Fpexels-ioana-motoc-4346328.jpeg?alt=media&token=2b55381b-cb11-4436-aa9f-ed004654d113',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fmeal%2Fpexels-ready-made-3850924.jpeg?alt=media&token=3230c850-adaf-47f3-bd6e-922750cd1f05',
        //     ],
        // },
        // {
        //     title: '其他',
        //     src: [
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fother%2FPhoto-by-Nataliya-Vaitkevich-from-Pexels.jpeg?alt=media&token=c183f15a-bd41-463f-acba-8e84baee6bb1',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fother%2FPhoto-by-RODNAE%20Productions-from-Pexels.jpeg?alt=media&token=37d17a3d-455b-4b94-a5ef-cc53d6ee6cab',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fother%2Fpexels-anna-shvets-3845495.jpeg?alt=media&token=4a51dbee-5211-41ea-804e-85758ea4ba94',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fother%2Fpexels-julia-kuzenkov-1974705.jpeg?alt=media&token=bebbd3d8-cb0f-464b-b9ce-a8f46185732c',
        //     ],
        // },
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
        // {
        //     title: '紙膠帶',
        //     src: [
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-01png.png?alt=media&token=a4e036ed-30f8-4fa3-929f-d51a6d281256',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-02.png?alt=media&token=8812fd2a-600b-4b16-9331-48cf4e870de6',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-03.png?alt=media&token=604b3548-6d4a-4d51-bf15-73a57d11e22a',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-04.png?alt=media&token=06360b8a-f9ca-4034-884e-b79674026cb9',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-05.png?alt=media&token=de15967e-73c6-47cf-8416-8afa6677b732',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-06.png?alt=media&token=d798ddaa-f957-4f63-af5b-72e602db2cc7',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-07.png?alt=media&token=e60cbd02-9169-4016-97ee-4cdeadb7eb28',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-08.png?alt=media&token=145cdf4c-cf19-4910-9b80-2a32a3f6dbc1',
        //     ],
        // },
        // {
        //     title: '太空',
        //     src: [
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fspace%2Fspace-01.png?alt=media&token=382718b6-067f-41f3-9e25-7f5fbce5ec38',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fspace%2Fspace-02.png?alt=media&token=e94bf30b-428e-4b84-ad84-daa01633efb9',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fspace%2Fspace-03.png?alt=media&token=1274fc14-ac1f-4579-8c46-ff96b6a0bf0e',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fspace%2Fspace-04.png?alt=media&token=c742d335-1081-4e59-bdf4-b5885f55d759',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fspace%2Fspace-05.png?alt=media&token=6535b95b-8ed0-44ec-b07a-657c03635132',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fspace%2Fspace-06.png?alt=media&token=7f505af0-2189-4bab-828d-07b77692c5a3',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fspace%2Fspace-08.png?alt=media&token=eb6ff0dd-f7f5-46d9-a080-558c941bc16e',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fspace%2Fspace-09.png?alt=media&token=6161b12a-b70e-4314-beb0-e1caadcec724',
        //     ],
        // },
        // {
        //     title: '怪獸',
        //     src: [
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmonster%2Fmonster-01.png?alt=media&token=30ac6b79-aa29-4a4c-934f-47811f94107d',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmonster%2Fmonster-02.png?alt=media&token=b0fb9d3a-e8f4-439c-8bbf-80b8507b3d39',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmonster%2Fmonster-03.png?alt=media&token=5831df4e-68d7-44bf-9776-af691a674156',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmonster%2Fmonster-04.png?alt=media&token=9aca3995-62e1-47ce-9ad4-b14b6585ffe3',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmonster%2Fmonster-05.png?alt=media&token=25347634-3f0b-4702-95d8-f16eea9a4a97',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmonster%2Fmonster-08.png?alt=media&token=be4cc132-592a-4dde-a1d4-02592e4e808f',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmonster%2Fmonster-09.png?alt=media&token=146b6470-1e45-481f-aa3e-63e15f99666c',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmonster%2Fmonster-10.png?alt=media&token=892e4cf7-bad9-4dff-acd1-91dea7a4624b',
        //     ],
        // },
        // {
        //     title: '肉食主義',
        //     src: [
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmeat%2Fmeat-01.png?alt=media&token=d5c54a6c-daa1-4dd2-b8cb-5899b12482ee',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmeat%2Fmeat-02.png?alt=media&token=033e4117-244e-4019-a90d-dd1e8e399727',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmeat%2Fmeat-03.png?alt=media&token=ddc78c4b-c0a5-4a7b-a458-124067948d8c',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmeat%2Fmeat-04.png?alt=media&token=bc8b05bd-f145-4683-9eb7-f4bfd3389e01',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmeat%2Fmeat-07.png?alt=media&token=2fac748f-7041-43c2-8ad2-306e4ff5e0e8',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmeat%2Fmeat-08.png?alt=media&token=1a59f9d7-3c61-4e29-9850-81de456c773d',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmeat%2Fmeat-09.png?alt=media&token=c887cd73-9b50-4925-9546-bb3d53b77fe2',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fmeat%2Fmeat-10.png?alt=media&token=ff360cc4-687e-4d80-b2e1-cd2d34414c9f',
        //     ],
        // },
        // {
        //     title: '健康蔬食',
        //     src: [
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ffruits%2Ffruit-01.png?alt=media&token=fb63f563-ba8e-4a66-ab06-2abd7abdac2c',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ffruits%2Ffruit-02.png?alt=media&token=84363afd-1e41-4448-ae10-ceb6540d8c42',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ffruits%2Ffruit-03.png?alt=media&token=95a4cef5-ce94-4e86-9eb7-f4ea40240d8c',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ffruits%2Ffruit-04.png?alt=media&token=74eeb181-8e4b-4434-9752-7c1abae96640',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ffruits%2Ffruit-05.png?alt=media&token=0e79df3f-8370-4a65-8a54-5fb6b688004f',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ffruits%2Ffruit-06.png?alt=media&token=b6a704bd-6e35-4fa8-abd0-f655ad4de40c',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ffruits%2Ffruit-10.png?alt=media&token=ec1ad2c5-c125-4910-b2d2-8a8a159791fc',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ffruits%2Ffruit-11.png?alt=media&token=7932b439-622a-4898-b596-eb98a19099b5',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ffruits%2Ffruit-12.png?alt=media&token=66c3593d-179d-42b3-9dea-7d6474ded30f',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ffruits%2Ffruit-13.png?alt=media&token=0db11f62-9845-4aaf-88dc-fae076cbdcff',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ffruits%2Ffruit-14.png?alt=media&token=aad60efa-f941-4213-aec8-b143669e9e29',
        //     ],
        // },
        // {
        //     title: '花朵',
        //     src: [
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fflowers%2Fflowers-sticker-01.png?alt=media&token=dc3c23fe-c59b-4c87-92ef-8a3feb61b453',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fflowers%2Fflowers-sticker-02.png?alt=media&token=af58386c-ad3d-4e46-b890-78e5b7a5c147',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fflowers%2Fflowers-sticker-03.png?alt=media&token=f55f8083-b6f8-4ff3-9f04-be4ac30b5413',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fflowers%2Fflowers-sticker-04.png?alt=media&token=d276b698-941e-45b5-a55e-758e8a3f1d1d',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fflowers%2Fflowers-sticker-05.png?alt=media&token=b1a57b82-16b0-448d-8e92-fd140a9c9b3c',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fflowers%2Fflowers-sticker-10.png?alt=media&token=eaff0940-e687-4149-8ec2-e64a42bc03ca',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fflowers%2Fflowers-sticker-11.png?alt=media&token=0418a7ef-f548-4896-8418-80ddd96b52d0',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fflowers%2Fflowers-sticker-12.png?alt=media&token=7f667b92-199c-44f3-955e-08c6750bcd94',
        //     ],
        // },
        // {
        //     title: '恐龍',
        //     src: [
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fdinosaur%2Fdinosaur-01.png?alt=media&token=47f05fb0-14ac-4a41-b671-94e8ca0f7225',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fdinosaur%2Fdinosaur-02.png?alt=media&token=b2af85f7-a9cd-4002-8937-24902dc1268a',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fdinosaur%2Fdinosaur-03.png?alt=media&token=6d596744-8cc9-4142-be14-a31399246c35',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fdinosaur%2Fdinosaur-04.png?alt=media&token=0875eb68-3f0a-4550-8a53-88e5cfeaf954',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fdinosaur%2Fdinosaur-05.png?alt=media&token=39fdf74a-aad8-4e68-aeca-6528d5375b0d',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fdinosaur%2Fdinosaur-06.png?alt=media&token=6a9919d6-bcc2-4bda-817d-e238413575e2',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fdinosaur%2Fdinosaur-09.png?alt=media&token=992255bf-9ec4-45a0-8003-e512e473e852',
        //         'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fdinosaur%2Fdinosaur-10.png?alt=media&token=d0f0fbe0-798d-422e-b495-5d87d5422680',
        //     ],
        // },
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
        // 'https://lh5.googleusercontent.com/_31n10mDCxhjranTyv1WlkP8l0E64tEOfkBx9343mnktdlwrqEOmYl1UgZKbQaDo8O-O35DyJhhPKFJXhRty=w2880-h1392-rw',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2Fmike-dorner-sf_1ZDA1YFw-unsplash.jpg?alt=media&token=69c116e8-7a81-4ca8-9884-58b67cb95f2f',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2Fmartin-adams-YA-DFlSzXBE-unsplash.jpg?alt=media&token=5d798c04-c9e2-4f99-a03d-a890bfbcc5f4',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2Fglen-carrie-Hn70XJd3uqI-unsplash.jpg?alt=media&token=296f60e9-c5c8-4f79-b031-4003be8bf714',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2Ffabrizio-conti-k6GpdsPJSZw-unsplash.jpg?alt=media&token=0118c93a-d875-4564-87f0-6243f4e35c3a',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2Ferol-ahmed-q9Vt4pVnGzc-unsplash.jpg?alt=media&token=d8411540-fa49-4859-8498-8293216e4849',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2Feberhard-grossgasteiger-XAxEp-NKBiQ-unsplash.jpg?alt=media&token=8d51206a-a517-4666-acd9-ce41731f4ea2',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2Fddp-EX3gFC6eP4c-unsplash.jpg?alt=media&token=d06397de-955b-4e86-a6a4-066ffc04fc84',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2Fchuttersnap-Zs_EII3lr4o-unsplash.jpg?alt=media&token=7ed451fa-b6dc-42d4-8609-1bf04fefab94',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2Farianka-ibarra-fz4j0RPp9qo-unsplash.jpg?alt=media&token=096f3303-2d39-4db8-b88a-c4d22d51afae',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2Fannie-spratt-lRcoPGrwkv0-unsplash.jpg?alt=media&token=9f7ceb09-ed82-4c5c-97c9-c62f69f0fa1a',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2Famy-shamblen-pJ_DCj9KswI-unsplash.jpg?alt=media&token=0b31b817-2c3f-46cc-a3e0-f36fa1db3ffd',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2FMountain%2006.jpg?alt=media&token=7bbb3c9d-64c3-47c0-aa9e-91ce3aca0575',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2FForest%2003.jpg?alt=media&token=045e81e8-0859-4b08-a302-2895b2259bea',
        // 'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/backgroundImages%2FCactus%2006.jpg?alt=media&token=301a82e5-3774-4da9-838d-c07b7a08e09d',
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
