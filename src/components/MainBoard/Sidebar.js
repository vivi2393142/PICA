import React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';
import * as icons from '../../img/icons.js';
import shape1 from '../../img/src/sidebarItems/shape1.svg';
import shape2 from '../../img/src/sidebarItems/shape2.svg';
import shape3 from '../../img/src/sidebarItems/shape3.svg';
import line1 from '../../img/src/sidebarItems/line1.svg';
import line2 from '../../img/src/sidebarItems/line2.svg';
import line3 from '../../img/src/sidebarItems/line3.svg';
import line4 from '../../img/src/sidebarItems/line4.svg';
import line5 from '../../img/src/sidebarItems/line5.svg';
import line6 from '../../img/src/sidebarItems/line6.svg';
import square from '../../img/src/sidebarItems/square.svg';
import triangle from '../../img/src/sidebarItems/triangle.svg';
import circle from '../../img/src/sidebarItems/circle.svg';

const Sidebar = (props) => {
    const mainColor = '#e89a4f';
    const [nextAddPosition, setNextAddPosition] = React.useState({ top: 10, left: 10 });
    const adjSetNextPosition = () => {
        if (
            nextAddPosition.left + 80 > props.canvasSetting.width / 2 ||
            nextAddPosition.top + 80 > props.canvasSetting.height / 2
        ) {
            setNextAddPosition({ top: 10, left: 10 });
        } else {
            setNextAddPosition({ top: nextAddPosition.top + 10, left: nextAddPosition.left + 10 });
        }
    };
    // add new components: rectangle, circle, triangle, text, image, background
    const addRect = () => {
        const rect = new fabric.Rect({
            top: nextAddPosition.top,
            left: nextAddPosition.left,
            height: 100,
            width: 100,
            fill: mainColor,
        });
        props.canvas.add(rect);
        props.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addCircle = () => {
        const circle = new fabric.Circle({
            top: nextAddPosition.top,
            left: nextAddPosition.left,
            radius: 50,
            fill: mainColor,
        });
        props.canvas.add(circle);
        props.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addTriangle = () => {
        const triangle = new fabric.Triangle({
            top: nextAddPosition.top,
            left: nextAddPosition.left,
            width: 100,
            height: 100,
            fill: mainColor,
        });
        props.canvas.add(triangle);
        props.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addShape = (e) => {
        fabric.loadSVGFromURL(e.target.src, (objects, options) => {
            const newShape = fabric.util.groupSVGElements(objects, options);
            newShape.set({
                top: nextAddPosition.top,
                left: nextAddPosition.left,
                scaleX: 2.2,
                scaleY: 2.2,
                id: 'shape',
            });
            props.canvas.add(newShape);
            props.canvas.requestRenderAll();
            adjSetNextPosition();
        });
    };
    const addIText = (title, size, weight) => {
        let text = new fabric.IText(title, {});
        text.set({
            top: nextAddPosition.top,
            left: nextAddPosition.left,
            fill: '#555555',
            fontSize: size,
            fontFamily: 'Sans-serif',
            fontWeight: weight,
        });
        props.canvas.add(text);
        text.setControlsVisibility({
            mb: false,
            mt: false,
            ml: false,
            mr: false,
        });
        props.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addImage = (e) => {
        fabric.Image.fromURL(
            e.target.src,
            (img) => {
                const oImg = img.set({
                    top: nextAddPosition.top,
                    left: nextAddPosition.left,
                    scaleX: e.target.width / e.target.naturalWidth,
                    scaleY: e.target.height / e.target.naturalHeight,
                });
                props.canvas.add(oImg);
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
        props.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addSticker = (e) => {
        fabric.Image.fromURL(
            e.target.src,
            (img) => {
                const oImg = img.set({
                    top: nextAddPosition.top,
                    left: nextAddPosition.left,
                    scaleX: e.target.width / e.target.naturalWidth,
                    scaleY: e.target.height / e.target.naturalHeight,
                    id: 'sticker',
                });
                props.canvas.add(oImg);
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
        props.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const backgroundColorHandler = (color) => {
        props.canvas.backgroundImage = 0;
        props.canvas.backgroundColor = color;
        props.canvas.requestRenderAll();
        props.canvas.fire('object:modified');
    };
    const backgroundImageHandler = (e) => {
        // remove exist background
        if (props.canvas.getObjects()[0].id === 'background') {
            props.canvas.remove(props.canvas.getObjects()[0]);
        }
        const scaleToWidth = props.canvasSetting.width / e.target.naturalWidth;
        const scaleToHeight = props.canvasSetting.height / e.target.naturalHeight;
        const scaleWay = scaleToWidth > scaleToHeight ? 'toWidth' : 'toHeight';
        fabric.Image.fromURL(
            e.target.src,
            (img) => {
                const backImg = img.set({
                    // fit canvas
                    scaleX: scaleWay === 'toWidth' ? scaleToWidth : scaleToHeight,
                    scaleY: scaleWay === 'toWidth' ? scaleToWidth : scaleToHeight,
                    id: 'background',
                });
                backImg.setControlsVisibility({
                    mb: false,
                    mt: false,
                    ml: false,
                    mr: false,
                    mtr: false,
                });
                if (scaleWay === 'toWidth') {
                    backImg.lockMovementX = true;
                } else {
                    backImg.lockMovementY = true;
                }
                props.canvas.add(backImg);
                backImg.sendToBack();
                // bounding can't be inside canvas
                backImg.on('modified', () => {
                    const currentSizeRatio =
                        parseInt(document.querySelector('.canvas-container').style.width) /
                        props.canvasSetting.width;
                    backImg.setCoords();
                    const { top, left, width, height } = backImg.getBoundingRect();
                    if (top > 0) {
                        backImg.top = 0;
                    }
                    if (top + height < props.canvas.getHeight()) {
                        backImg.top = (props.canvas.getHeight() - height) / currentSizeRatio;
                    }
                    if (left > 0) {
                        backImg.left = 0;
                    }
                    if (left + width < props.canvas.getWidth()) {
                        backImg.left = (props.canvas.getWidth() - width) / currentSizeRatio;
                    }
                    props.canvas.requestRenderAll();
                });
            },
            {
                crossOrigin: 'anonymous',
            }
        );
    };

    // backgroundColor
    const [hasBackColor, setHasBackColor] = React.useState(false);
    const [isChoosingBackColor, setIsChoosingBackColor] = React.useState(false);
    const [backColorChosen, setBackColorChosen] = React.useState({
        background: {
            r: '255',
            g: '255',
            b: '255',
            a: '1',
        },
    });
    const toggleAddBackColor = () => {
        if (hasBackColor) {
            document.querySelector('.colorChartWrapper').classList.remove('colorChartUnfold');
            document.querySelector('.colorChartWrapper').classList.add('colorChartFold');
            backgroundColorHandler('rgba(255, 255, 255, 1)');
            setBackColorChosen({
                background: 'rgba(255, 255, 255, 1)',
            });
        } else {
            // remove exist background
            if (props.canvas.getObjects()[0].id === 'background') {
                props.canvas.remove(props.canvas.getObjects()[0]);
            }
            document.querySelector('.colorChartWrapper').classList.add('colorChartUnfold');
            document.querySelector('.colorChartWrapper').classList.remove('colorChartFold');
        }
        setHasBackColor(!hasBackColor);
    };
    const toggleBackColorSelection = (e) => {
        const clickedOrNot = (e) => {
            if (!document.querySelector('.backgroundPicker').contains(e.target)) {
                setIsChoosingBackColor(false);
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
        props.canvas.requestRenderAll();
    };
    const handleBackColorChangeCube = (e) => {
        const color = e.target.style.backgroundColor;
        setBackColorChosen({ background: color });
        backgroundColorHandler(color);
        props.canvas.requestRenderAll();
    };
    // add new components: frame
    const addFrameA = (col, spacing) => {
        const rectBack = new fabric.Rect({
            height: props.canvasSetting.height,
            width: props.canvasSetting.width,
            stroke: 'black',
            fill: 'transparent',
            isClipFrame: true,
        });
        let groupItem = [rectBack];
        for (let i = 0; i < col; i++) {
            let rect = new fabric.Rect({
                top: 0,
                left:
                    (props.canvasSetting.width - spacing * (col - 1)) / col +
                    spacing * (i === 0 ? 0 : 1),
                height: props.canvasSetting.height,
                width: (props.canvasSetting.width - spacing * (col - 1)) / col,
                stroke: mainColor,
                fill: 'transparent',
                isClipFrame: true,
            });
            groupItem.push(rect);
        }
        const group = new fabric.Group(groupItem);
        props.canvas.add(group);
        props.canvas.requestRenderAll();
    };

    // TODO: 測試用資料，待刪除
    const logCurrentCanvas = () => {
        var json = props.canvas.toJSON();
        console.log(JSON.stringify(json));
    };

    // jsx + functions: img adjustment
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
        props.activeObj.filters = [];
        props.activeObj.applyFilters();
        props.canvas.requestRenderAll();
    };
    const imageFiltersJsx = customFilters.map((item, index) => (
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
                    props.activeObj.filters[index] = newFilter;
                    props.activeObj.applyFilters();
                    props.canvas.requestRenderAll();
                }}
                step={item.step}
            ></input>
            <div className='imgAdjustValue'>{currentFilters[item.attr]}</div>
        </div>
    ));
    // jsx : sidebar
    const sidebarArray = [
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
            EN: 'frame',
            CH: '框架',
            icon: <icons.SidebarFrame className='sidebarIcon' />,
            iconB: <icons.SidebarFrameB className='sidebarIcon' />,
        },
        {
            EN: 'upload',
            CH: '上傳',
            icon: <icons.SidebarUpload className='sidebarIcon' />,
            iconB: <icons.SidebarUploadB className='sidebarIcon' />,
        },
        {
            EN: 'more',
            CH: '更多',
            icon: <icons.SidebarMore className='sidebarIcon' />,
            iconB: <icons.SidebarMoreB className='sidebarIcon' />,
        },
    ];
    const sidebarFoldJsx = sidebarArray.map((item, index) => (
        <div
            key={index}
            className={`sideButton ${
                props.currentSidebar === 'text' && props.currentSidebar === item.EN
                    ? 'sideButtonChosen firstButton'
                    : props.currentSidebar === 'more' && props.currentSidebar === item.EN
                    ? 'sideButtonChosen lastButton'
                    : props.currentSidebar === item.EN
                    ? 'sideButtonChosen'
                    : ''
            }`}
            onClick={() => props.setCurrentSidebar(item.EN)}
        >
            {props.currentSidebar === item.EN ? item.icon : item.iconB}
            <div className={`iconText ${props.currentSidebar === item.EN ? 'iconTextB' : ''}`}>
                {item.CH}
            </div>
        </div>
    ));

    // jsx: sidebar -

    // get current image styles
    React.useEffect(() => {
        if (props.activeObj.type === 'image') {
            let filtersActive = {
                brightness: 0,
                contrast: 0,
                saturation: 0,
                rotation: 0,
                blur: 0,
                noise: 0,
            };
            props.activeObj.filters.forEach((item) => {
                let type = item.type.toLowerCase();
                if (type === 'huerotation') {
                    filtersActive.rotation = parseFloat(item.rotation);
                } else {
                    filtersActive[type] = parseFloat(item[type]);
                }
            });
            setCurrentFilters(filtersActive);
        }
    }, [props.activeObj]);

    return (
        <div className='sidebar'>
            <div className='sidebarFold'>{sidebarFoldJsx}</div>
            {props.currentSidebar !== '' ? (
                <div
                    className={`sidebarUnfold sidebarUnfoldUpload ${
                        props.currentSidebar === 'text' ? 'firstUnfold' : ''
                    }`}
                >
                    {props.currentSidebar === 'text' ? (
                        <div
                            className='sidebarUnfoldInner sidebarUnfoldText'
                            onMouseDown={(e) => props.saveDragItem.func(e)}
                        >
                            <div
                                draggable='true'
                                className='unfoldItem addTextBig '
                                onClick={() =>
                                    addIText(
                                        props.textSetting[0].title,
                                        props.textSetting[0].size,
                                        props.textSetting[0].fontWeight
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
                                        props.textSetting[1].title,
                                        props.textSetting[1].size,
                                        props.textSetting[1].fontWeight
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
                                        props.textSetting[2].title,
                                        props.textSetting[2].size,
                                        props.textSetting[2].fontWeight
                                    )
                                }
                            >
                                新增內文
                            </div>
                        </div>
                    ) : props.currentSidebar === 'shape' ? (
                        <div
                            className='sidebarUnfoldInner sidebarUnfoldShape'
                            onMouseDown={(e) => props.saveDragItem.func(e)}
                        >
                            <div className='sidebarUnfoldSubtitle'>常用形狀</div>
                            <img
                                src={square}
                                className='unfoldItem rectShape '
                                draggable='true'
                                onClick={addRect}
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
                            <img
                                src={shape1}
                                draggable='true'
                                className='unfoldItem abnormalShape'
                                onClick={addShape}
                            ></img>
                            <img
                                src={shape2}
                                className='unfoldItem abnormalShape'
                                draggable='true'
                                onClick={addShape}
                            ></img>
                            <img
                                src={shape3}
                                className='unfoldItem abnormalShape'
                                draggable='true'
                                onClick={addShape}
                            ></img>
                        </div>
                    ) : props.currentSidebar === 'line' ? (
                        <div
                            className='sidebarUnfoldInner sidebarUnfoldLine'
                            onMouseDown={(e) => props.saveDragItem.func(e)}
                        >
                            <img
                                src={line1}
                                className='unfoldItem itemLine'
                                onClick={addShape}
                                draggable='true'
                            ></img>
                            <img
                                src={line2}
                                className='unfoldItem itemLine'
                                onClick={addShape}
                                draggable='true'
                            ></img>
                            <img
                                src={line3}
                                className='unfoldItem itemLine'
                                onClick={addShape}
                                draggable='true'
                            ></img>
                            <img
                                src={line4}
                                className='unfoldItem itemLine'
                                onClick={addShape}
                                draggable='true'
                            ></img>
                            <img
                                src={line5}
                                className='unfoldItem itemLine'
                                onClick={addShape}
                                draggable='true'
                            ></img>
                            <img
                                src={line6}
                                className='unfoldItem itemLine'
                                onClick={addShape}
                                draggable='true'
                            ></img>
                        </div>
                    ) : props.currentSidebar === 'image' ? (
                        <div
                            className='sidebarUnfoldInner sidebarUnfoldImg'
                            onMouseDown={(e) => props.saveDragItem.func(e)}
                        >
                            <img
                                onClick={addImage}
                                className='unfoldItem'
                                draggable='true'
                                src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                            ></img>
                            <img
                                onClick={addImage}
                                className='unfoldItem'
                                draggable='true'
                                src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                            ></img>
                        </div>
                    ) : props.currentSidebar === 'background' ? (
                        <div className='sidebarUnfoldInner sidebarUnfoldBack'>
                            <div className='backgroundTitleOuter'>
                                <div className='sidebarUnfoldSubtitle backgroundTitle'>
                                    背景色彩
                                </div>
                                {hasBackColor ? (
                                    <div
                                        className='backgroundCheckboxMinus'
                                        onClick={toggleAddBackColor}
                                    >
                                        －
                                    </div>
                                ) : (
                                    <div
                                        className='backgroundCheckboxAdd'
                                        onClick={toggleAddBackColor}
                                    >
                                        ＋
                                    </div>
                                )}
                            </div>
                            <div className='colorChartWrapper'>
                                <div className='currentBackground'>
                                    <div
                                        className='backgroundColorCube currentColorCube'
                                        style={{ backgroundColor: backColorChosen.background }}
                                        onClick={toggleBackColorSelection}
                                    ></div>
                                    {isChoosingBackColor ? (
                                        <ChromePicker
                                            className='backgroundPicker'
                                            color={backColorChosen.background}
                                            onChange={handleBackColorChange}
                                        />
                                    ) : null}
                                </div>
                                <div className='backgroundColorChart'>
                                    <div
                                        className='backgroundColorCube'
                                        style={{ backgroundColor: '#FCB900' }}
                                        onClick={handleBackColorChangeCube}
                                    ></div>
                                    <div
                                        className='backgroundColorCube'
                                        style={{ backgroundColor: '#FF6900' }}
                                        onClick={handleBackColorChangeCube}
                                    ></div>
                                    <div
                                        className='backgroundColorCube'
                                        style={{ backgroundColor: '#7BDCB5' }}
                                        onClick={handleBackColorChangeCube}
                                    ></div>
                                    <div
                                        className='backgroundColorCube'
                                        style={{ backgroundColor: '#00D084' }}
                                        onClick={handleBackColorChangeCube}
                                    ></div>
                                    <div
                                        className='backgroundColorCube'
                                        style={{ backgroundColor: '#8ED1FC' }}
                                        onClick={handleBackColorChangeCube}
                                    ></div>
                                    <div
                                        className='backgroundColorCube'
                                        style={{ backgroundColor: '#0693E3' }}
                                        onClick={handleBackColorChangeCube}
                                    ></div>
                                    <div
                                        className='backgroundColorCube'
                                        style={{ backgroundColor: '#ABB8C3' }}
                                        onClick={handleBackColorChangeCube}
                                    ></div>
                                    <div
                                        className='backgroundColorCube'
                                        style={{ backgroundColor: '#EB144C' }}
                                        onClick={handleBackColorChangeCube}
                                    ></div>
                                    <div
                                        className='backgroundColorCube'
                                        style={{ backgroundColor: '#F78DA7' }}
                                        onClick={handleBackColorChangeCube}
                                    ></div>
                                    <div
                                        className='backgroundColorCube'
                                        style={{ backgroundColor: '#9900EF' }}
                                        onClick={handleBackColorChangeCube}
                                    ></div>
                                </div>
                            </div>
                            <div className='sidebarUnfoldSubtitle backgroundTitle'>背景圖片</div>
                            <div className='backImgChart'>
                                <img
                                    draggable='false'
                                    onClick={backgroundImageHandler}
                                    className='unfoldItem'
                                    src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                                ></img>
                                <img
                                    draggable='false'
                                    onClick={backgroundImageHandler}
                                    className='unfoldItem'
                                    src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                                ></img>
                                <img
                                    draggable='false'
                                    onClick={backgroundImageHandler}
                                    className='unfoldItem'
                                    src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                                ></img>
                                <img
                                    draggable='false'
                                    onClick={backgroundImageHandler}
                                    className='unfoldItem'
                                    src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                                ></img>
                                <img
                                    draggable='false'
                                    onClick={backgroundImageHandler}
                                    className='unfoldItem'
                                    src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                                ></img>
                                <img
                                    draggable='false'
                                    onClick={backgroundImageHandler}
                                    className='unfoldItem'
                                    src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                                ></img>
                                <img
                                    draggable='false'
                                    onClick={backgroundImageHandler}
                                    className='unfoldItem'
                                    src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                                ></img>
                                <img
                                    draggable='false'
                                    onClick={backgroundImageHandler}
                                    className='unfoldItem'
                                    src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                                ></img>
                                <img
                                    draggable='false'
                                    onClick={backgroundImageHandler}
                                    className='unfoldItem'
                                    src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                                ></img>
                                <img
                                    draggable='false'
                                    onClick={backgroundImageHandler}
                                    className='unfoldItem'
                                    src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                                ></img>
                            </div>
                        </div>
                    ) : props.currentSidebar === 'upload' ? (
                        <div className='sidebarUnfoldInner'>
                            <div className='unfoldItem'></div>
                        </div>
                    ) : props.currentSidebar === 'frame' ? (
                        <div className='sidebarUnfoldInner sidebarUnfoldFrame' t>
                            <div className='unfoldItem' onClick={() => addFrameA(5, 10)}>
                                新增框架
                            </div>
                        </div>
                    ) : props.currentSidebar === 'sticker' ? (
                        <div
                            className='sidebarUnfoldInner sidebarUnfoldSticker'
                            onMouseDown={(e) => props.saveDragItem.func(e)}
                        >
                            <img
                                onClick={addSticker}
                                draggable='true'
                                className='unfoldItem'
                                src='https://cdn.glitch.com/4c9ebeb9-8b9a-4adc-ad0a-238d9ae00bb5%2Fmdn_logo-only_color.svg?1535749917189'
                            ></img>
                            <img
                                onClick={addSticker}
                                draggable='true'
                                className='unfoldItem'
                                src='https://cdn.glitch.com/4c9ebeb9-8b9a-4adc-ad0a-238d9ae00bb5%2Fmdn_logo-only_color.svg?1535749917189'
                            ></img>
                        </div>
                    ) : props.currentSidebar === 'more' ? (
                        <div className='sidebarUnfoldInner'>
                            <div className='unfoldItem' onClick={logCurrentCanvas}>
                                印出canvas(測試用)
                            </div>
                        </div>
                    ) : props.currentSidebar === 'imageAdjustment' ? (
                        <div className='sidebarUnfoldInner unfoldImgAdjustment'>
                            {imageFiltersJsx}
                            <div className='resetFilterButton' onClick={resetFilters}>
                                重設圖片
                            </div>
                        </div>
                    ) : null}
                    {props.currentSidebar !== 'imageAdjustment' ? (
                        <div
                            className='sidebarCloseButton'
                            onClick={() => {
                                props.setCurrentSidebar('');
                            }}
                        >
                            {'<'}
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

Sidebar.propTypes = {
    canvas: PropTypes.object.isRequired,
    setCanvas: PropTypes.func.isRequired,
    currentSidebar: PropTypes.string.isRequired,
    setCurrentSidebar: PropTypes.func.isRequired,
    setActiveObj: PropTypes.func.isRequired,
    activeObj: PropTypes.object.isRequired,
    trackOutSideClick: PropTypes.func.isRequired,
    saveDragItem: PropTypes.object.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    textSetting: PropTypes.array.isRequired,
};

export default Sidebar;
