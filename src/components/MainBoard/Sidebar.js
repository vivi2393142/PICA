import React from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../icons.js';

const Sidebar = (props) => {
    const mainColor = '#e89a4f';
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

    return (
        <div className='sidebar'>
            <icons.Test />
            <div className='sideButton' onClick={addRect}>
                新增方形
            </div>
            <div className='sideButton' onClick={addCircle}>
                新增圓形
            </div>
            <div className='sideButton' onClick={addTriangle}>
                新增三角形
            </div>
            <div className='sideButton' onClick={addIText}>
                新增文字
            </div>
            <div className='sideButton' onClick={addImage}>
                新增圖片
            </div>
            <div className='sideButton' onClick={backgroundColorHandler}>
                加入背景色彩
            </div>
            <div className='sideButton' onClick={backgroundImageHandler}>
                加入背景圖片
            </div>
            <div className='sideButton' onClick={logCurrentCanvas}>
                印出canvas
            </div>
        </div>
    );
};

Sidebar.propTypes = { canvas: PropTypes.object.isRequired, setCanvas: PropTypes.func.isRequired };

export default Sidebar;
