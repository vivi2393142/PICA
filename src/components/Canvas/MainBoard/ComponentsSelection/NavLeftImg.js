import React from 'react';
import PropTypes from 'prop-types';
import 'fabric-history';
import { trackOutSideClick } from '../../../../utils/globalUtils.js';

let croppingObjIndex = 0;

const NavLeftImg = (props) => {
    // toggle adjustment nav
    const toggleImageAdjustmentNav = () => {
        props.setCurrentSidebar('imageAdjustment');
        const targetDiv = document.querySelector('.sidebar');
        trackOutSideClick(targetDiv, () => {
            props.setCurrentSidebar('');
            props.canvas.fire('object:modified');
        });
    };
    // crop image
    // -- preset dark background, cropping target index
    const darkBackground = new fabric.Rect({
        height: props.canvasSetting.height,
        width: props.canvasSetting.width,
        fill: 'rgba(0, 0, 0, 0.8)',
        specialType: 'cropBackground',
    });
    const startCropping = () => {
        props.canvas.offHistory();
        // --- update cropping obj
        props.setCroppingObj(props.activeObj);
        // --- add dark background and enable to choose other then crop box
        darkBackground.on('mousedown', () => {
            props.canvas.setActiveObject(clipPathView);
        });
        props.canvas.add(darkBackground);
        // --- disable all controls
        props.canvas.getObjects().forEach((obj) => {
            obj.hasControls = false;
            obj.selectable = false;
            obj.hoverCursor = 'default';
        });
        // --- get cropping target index then send to the top
        croppingObjIndex = props.canvas.getObjects().indexOf(props.activeObj);
        props.activeObj.bringToFront();
        // --- preset clippath
        const currentObj = props.activeObj;
        currentObj.clipPath = null;
        // --- clone cropping target to create crop box
        const clipPathView = new fabric.Rect({
            specialType: 'cropbox',
            originX: currentObj.originX,
            originY: currentObj.originY,
            left: currentObj.left,
            top: currentObj.top,
            width: currentObj.width * currentObj.scaleX - 1,
            height: currentObj.height * currentObj.scaleY - 1,
            angle: currentObj.angle,
            fill: 'rgba(0,0,0,0)',
            borderDashArray: [5, 3],
            borderColor: '#e89a4f',
            cornerColor: '#e89a4f',
            cornerStrokeColor: '#e89a4f',
        });
        props.canvas.add(clipPathView);
        clipPathView.set({ borderColor: '#e89a4f' });
        clipPathView.lockMovementX = true;
        clipPathView.lockMovementY = true;
        clipPathView.hoverCursor = 'default';
        clipPathView.setControlsVisibility({
            mtr: false,
        });
        props.canvas.setActiveObject(clipPathView);
    };
    const confirmCropping = () => {
        // --- set actual clippath through crop box(since the location mode is different)
        const clipPath = new fabric.Rect({
            height: (props.activeObj.height * props.activeObj.scaleY) / props.croppingObj.scaleY + 4,
            width: (props.activeObj.width * props.activeObj.scaleX) / props.croppingObj.scaleX + 4,
            top:
                (-props.activeObj.height / 2 + props.activeObj.top - props.croppingObj.top) /
                    props.croppingObj.scaleY -
                2,
            left:
                (-props.activeObj.width / 2 + props.activeObj.left - props.croppingObj.left) /
                    props.croppingObj.scaleX -
                2,
        });
        // --- enable all controls
        props.canvas.getObjects().forEach((obj) => {
            obj.hasControls = true;
            obj.selectable = true;
            obj.hoverCursor = 'move';
        });

        // --- remove crop box and dark background
        props.canvas.remove(props.activeObj);
        props.canvas.remove(props.canvas.getObjects()[props.canvas.getObjects().length - 2]);
        // --- reset clippath and index
        props.croppingObj.clipPath = clipPath;
        props.canvas.moveTo(props.croppingObj, croppingObjIndex);
        // --- update cropping obj
        props.setCroppingObj({});
        // --- render
        props.canvas.requestRenderAll();
        props.canvas.onHistory();
    };
    const cancelCropping = () => {
        console.log('取消');
        // --- enable all controls
        props.canvas.getObjects().forEach((obj) => {
            obj.hasControls = true;
            obj.selectable = true;
            obj.hoverCursor = 'move';
        });
        // --- reset index
        props.canvas.moveTo(props.croppingObj, croppingObjIndex);
        // --- update cropping obj
        props.setCroppingObj({});
        // --- remove crop box and dark background
        props.canvas.remove(props.activeObj);
        props.canvas.remove(props.canvas.getObjects()[props.canvas.getObjects().length - 1]);
        // --- render
        props.canvas.requestRenderAll();
        props.canvas.onHistory();
    };

    // render
    return (
        <div className='specificNav'>
            {props.activeObj.type === 'image' && !props.croppingObj.type && (
                <div className='specificButton navTypeWord' onClick={toggleImageAdjustmentNav}>
                    調整圖片
                </div>
            )}
            {props.activeObj.type === 'image' && !props.croppingObj.type && (
                <div className='specificButton navTypeWord' onClick={startCropping}>
                    裁剪圖片
                </div>
            )}
            {props.croppingObj.type && (
                <div className='specificButton cropSelection' onClick={cancelCropping}>
                    <span className='cropSelection'>X</span>取消
                </div>
            )}
            {props.croppingObj.type && (
                <div className='specificButton cropSelection' onClick={confirmCropping}>
                    <span className='cropSelection'>O</span>完成
                </div>
            )}
        </div>
    );
};

NavLeftImg.propTypes = {
    currentSidebar: PropTypes.string.isRequired,
    setCurrentSidebar: PropTypes.func.isRequired,
    croppingObj: PropTypes.object.isRequired,
    setCroppingObj: PropTypes.func.isRequired,
    canvas: PropTypes.object.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    activeObj: PropTypes.object.isRequired,
};

export default React.memo(NavLeftImg);
