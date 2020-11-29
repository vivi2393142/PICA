import React from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../icons.js';

const Sidebar = (props) => {
    const mainColor = '#e89a4f';
    const [currentSidebar, setCurrentSidebar] = React.useState('');
    console.log(currentSidebar);
    // -- add new components: rectangle, circle, triangle, text, image
    const addRect = () => {
        const rect = new fabric.Rect({
            height: 100,
            width: 100,
            fill: mainColor,
        });
        props.canvas.add(rect);
    };
    const addCircle = () => {
        const circle = new fabric.Circle({
            radius: 50,
            fill: mainColor,
        });
        props.canvas.add(circle);
        props.canvas.requestRenderAll();
    };
    const addTriangle = () => {
        const triangle = new fabric.Triangle({
            width: 100,
            height: 100,
            fill: mainColor,
        });
        props.canvas.add(triangle);
        props.canvas.requestRenderAll();
    };
    const addIText = () => {
        let text = new fabric.IText('雙擊我編輯', {});
        props.canvas.add(text);
        text.setControlsVisibility({
            mb: false,
            mt: false,
            ml: false,
            mr: false,
        });

        props.canvas.requestRenderAll();
    };
    const addImage = () => {
        fabric.Image.fromURL(
            'https://www.pakutaso.com/shared/img/thumb/AMEMAN17826009_TP_V.jpg',
            (img) => {
                const oImg = img.set({
                    scaleX: 0.1,
                    scaleY: 0.1,
                });
                props.canvas.add(oImg);
                oImg.setControlsVisibility({
                    mb: false,
                    mt: false,
                    ml: false,
                    mr: false,
                });
            }
        );
        props.canvas.requestRenderAll();
    };
    // -- add new components: add background
    const backgroundColorHandler = () => {
        props.canvas.backgroundImage = 0;
        props.canvas.backgroundColor = mainColor;
        props.canvas.requestRenderAll();
        // trigger 'object:modified' event
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

    // TODO: 測試用資料，待刪除
    const logCurrentCanvas = () => {
        var json = props.canvas.toJSON();
        console.log(JSON.stringify(json));
    };

    // jsx
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

    let sidebarFold = [];
    sidebarArray.forEach((item, index) => {
        let newItem = (
            <div
                key={index}
                className={`sideButton ${
                    currentSidebar === 'text' && currentSidebar === item.EN
                        ? 'sideButtonChosen firstButton'
                        : currentSidebar === item.EN
                        ? 'sideButtonChosen'
                        : null
                }`}
                onClick={() => setCurrentSidebar(item.EN)}
            >
                {currentSidebar === item.EN ? item.iconB : item.icon}
                <div className={`iconText ${currentSidebar === item.EN ? 'iconTextB' : null}`}>
                    {item.CH}
                </div>
            </div>
        );
        sidebarFold.push(newItem);
    });
    return (
        <div className='sidebar'>
            <div className='sidebarFold'>{sidebarFold}</div>
            {currentSidebar !== '' ? (
                <div
                    className={`sidebarUnfold sidebarUnfoldUpload ${
                        currentSidebar === 'text' ? 'firstUnfold' : null
                    }`}
                >
                    {currentSidebar === 'text' ? (
                        <div className='sidebarUnfoldInner'>
                            <div className='unfoldItem' onClick={addIText}>
                                新增文字
                            </div>
                        </div>
                    ) : currentSidebar === 'shape' ? (
                        <div className='sidebarUnfoldInner'>
                            <div className='unfoldItem' onClick={addRect}>
                                新增方形
                            </div>
                            <div className='unfoldItem' onClick={addCircle}>
                                新增圓形
                            </div>
                            <div className='unfoldItem' onClick={addTriangle}>
                                新增三角形
                            </div>
                        </div>
                    ) : currentSidebar === 'image' ? (
                        <div className='sidebarUnfoldInner'>
                            <div className='unfoldItem' onClick={addImage}>
                                新增照片
                            </div>
                        </div>
                    ) : currentSidebar === 'background' ? (
                        <div className='sidebarUnfoldInner'>
                            <div className='unfoldItem' onClick={backgroundColorHandler}>
                                新增背景色彩
                            </div>
                            <div className='unfoldItem' onClick={backgroundImageHandler}>
                                新增背景圖片
                            </div>
                        </div>
                    ) : currentSidebar === 'upload' ? (
                        <div className='sidebarUnfoldInner'>
                            <div className='unfoldItem'></div>
                        </div>
                    ) : currentSidebar === 'frame' ? (
                        <div className='sidebarUnfoldInner'>
                            <div className='unfoldItem'>新增框架</div>
                        </div>
                    ) : currentSidebar === 'sticker' ? (
                        <div className='sidebarUnfoldInner'>
                            <div className='unfoldItem'>新增貼圖</div>
                        </div>
                    ) : currentSidebar === 'line' ? (
                        <div className='sidebarUnfoldInner'>
                            <div className='unfoldItem'>新增線條</div>
                        </div>
                    ) : currentSidebar === 'more' ? (
                        <div className='sidebarUnfoldInner'>
                            <div className='unfoldItem' onClick={logCurrentCanvas}>
                                印出canvas(測試用)
                            </div>
                        </div>
                    ) : null}
                    <div className='sidebarCloseButton' onClick={() => setCurrentSidebar('')}>
                        {'<'}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

Sidebar.propTypes = { canvas: PropTypes.object.isRequired, setCanvas: PropTypes.func.isRequired };

export default Sidebar;
