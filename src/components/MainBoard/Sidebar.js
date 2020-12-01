import React from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../img/icons.js';
import * as sideItems from '../../img/sidebarItems.js';
import shape1 from '../../img/src/sidebarItems/shape1.svg';
import shape2 from '../../img/src/sidebarItems/shape2.svg';
import shape3 from '../../img/src/sidebarItems/shape3.svg';
import line1 from '../../img/src/sidebarItems/line1.svg';
import line2 from '../../img/src/sidebarItems/line2.svg';
import line3 from '../../img/src/sidebarItems/line3.svg';
import line4 from '../../img/src/sidebarItems/line4.svg';
import line5 from '../../img/src/sidebarItems/line5.svg';
import line6 from '../../img/src/sidebarItems/line6.svg';

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
    const addImage = () => {
        fabric.Image.fromURL(
            'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg',
            (img) => {
                const oImg = img.set({
                    top: nextAddPosition.top,
                    left: nextAddPosition.left,
                    scaleX: 1,
                    scaleY: 1,
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
    const backgroundColorHandler = () => {
        props.canvas.backgroundImage = 0;
        props.canvas.backgroundColor = mainColor;
        props.canvas.requestRenderAll();
        props.canvas.fire('object:modified');
    };
    const backgroundImageHandler = () => {
        fabric.Image.fromURL(
            'https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg?cs=srgb&dl=pexels-matheus-natan-3394939.jpg&fm=jpg',
            function (img) {
                props.canvas.setBackgroundColor(img);
                props.canvas.setBackgroundImage(
                    img,
                    props.canvas.requestRenderAll.bind(props.canvas),
                    {
                        scaleX: props.canvas.width / img.width,
                        scaleY: props.canvas.height / img.height,
                    }
                );
            }
        );
        // trigger 'object:modified' event
        props.canvas.fire('object:modified');
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
            EN: 'image',
            CH: '照片',
            icon: <icons.SidebarImage className='sidebarIcon' />,
            iconB: <icons.SidebarImageB className='sidebarIcon' />,
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
        {
            EN: 'frame',
            CH: '框架',
            icon: <icons.SidebarFrame className='sidebarIcon' />,
            iconB: <icons.SidebarFrameB className='sidebarIcon' />,
        },
        {
            EN: 'sticker',
            CH: '貼圖',
            icon: <icons.SidebarSticker className='sidebarIcon' />,
            iconB: <icons.SidebarStickerB className='sidebarIcon' />,
        },
        {
            EN: 'line',
            CH: '線條',
            icon: <icons.SidebarLine className='sidebarIcon' />,
            iconB: <icons.SidebarLineB className='sidebarIcon' />,
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
                    : null
            }`}
            onClick={() => props.setCurrentSidebar(item.EN)}
        >
            {props.currentSidebar === item.EN ? item.icon : item.iconB}
            <div className={`iconText ${props.currentSidebar === item.EN ? 'iconTextB' : null}`}>
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
                        <div className='sidebarUnfoldInner sidebarUnfoldText'>
                            <div
                                className='unfoldItem addTextBig draggableItem'
                                onClick={() => addIText('雙擊以編輯標題', 36, 'bold')}
                            >
                                新增標題
                            </div>
                            <div
                                className='unfoldItem addTextMiddle draggableItem'
                                onClick={() => addIText('雙擊以編輯副標', 28, 'normal')}
                            >
                                新增副標
                            </div>
                            <div
                                className='unfoldItem addTextSmall draggableItem'
                                onClick={() => addIText('雙擊以編輯內文', 18, 'normal')}
                            >
                                新增內文
                            </div>
                        </div>
                    ) : props.currentSidebar === 'shape' ? (
                        <div className='sidebarUnfoldInner sidebarUnfoldShape'>
                            <div className='sidebarUnfoldSubtitle'>常用形狀</div>
                            <sideItems.Square className='unfoldItem' onClick={addRect} />
                            <sideItems.Circle className='unfoldItem' onClick={addCircle} />
                            <sideItems.Triangle className='unfoldItem' onClick={addTriangle} />
                            <div className='sidebarUnfoldSubtitle'>不規則形狀</div>
                            <img src={shape1} className='unfoldItem' onClick={addShape}></img>
                            <img src={shape2} className='unfoldItem' onClick={addShape}></img>
                            <img src={shape3} className='unfoldItem' onClick={addShape}></img>
                        </div>
                    ) : props.currentSidebar === 'image' ? (
                        <div
                            className='sidebarUnfoldInner sidebarUnfoldImg'
                            onMouseDown={(e) => props.saveDragItem.func(e)}
                        >
                            <div className='unfoldItem' onClick={addImage}>
                                新增照片
                            </div>
                            <img
                                className='unfoldItem draggableItem'
                                src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                            ></img>
                            <img
                                className='unfoldItem draggableItem'
                                src='https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'
                            ></img>
                        </div>
                    ) : props.currentSidebar === 'background' ? (
                        <div className='sidebarUnfoldInner sidebarUnfoldBack'>
                            <div className='unfoldItem' onClick={backgroundColorHandler}>
                                新增背景色彩
                            </div>
                            <div className='unfoldItem' onClick={backgroundImageHandler}>
                                新增背景圖片
                            </div>
                        </div>
                    ) : props.currentSidebar === 'upload' ? (
                        <div className='sidebarUnfoldInner'>
                            <div className='unfoldItem'></div>
                        </div>
                    ) : props.currentSidebar === 'frame' ? (
                        <div className='sidebarUnfoldInner sidebarUnfoldFrame'>
                            <div className='unfoldItem' onClick={() => addFrameA(5, 10)}>
                                新增框架
                            </div>
                        </div>
                    ) : props.currentSidebar === 'sticker' ? (
                        <div className='sidebarUnfoldInner sidebarUnfoldSticker'>
                            <img
                                className='unfoldItem draggableItem'
                                src='https://opendoodles.s3-us-west-1.amazonaws.com/Doggie.png'
                            ></img>
                            <img
                                className='unfoldItem draggableItem'
                                src='https://opendoodles.s3-us-west-1.amazonaws.com/ballet.png'
                            ></img>
                        </div>
                    ) : props.currentSidebar === 'line' ? (
                        <div className='sidebarUnfoldInner sidebarUnfoldLine'>
                            <img
                                src={line1}
                                className='unfoldItem itemLine'
                                onClick={addShape}
                            ></img>
                            <img
                                src={line2}
                                className='unfoldItem itemLine'
                                onClick={addShape}
                            ></img>
                            <img
                                src={line3}
                                className='unfoldItem itemLine'
                                onClick={addShape}
                            ></img>
                            <img
                                src={line4}
                                className='unfoldItem itemLine'
                                onClick={addShape}
                            ></img>
                            <img
                                src={line5}
                                className='unfoldItem itemLine'
                                onClick={addShape}
                            ></img>
                            <img
                                src={line6}
                                className='unfoldItem itemLine'
                                onClick={addShape}
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
};

export default Sidebar;
