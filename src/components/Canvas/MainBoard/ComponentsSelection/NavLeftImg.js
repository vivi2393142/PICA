import React from 'react';
import PropTypes from 'prop-types';
import 'fabric-history';
import { trackOutSideClick } from '../../../../utils/globalUtils.js';
import * as cropImageUtils from '../../../../utils/cropImage';

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
    const startCropping = () => {
        props.setCroppingObj(props.activeObj);
        croppingObjIndex = props.canvas.getObjects().indexOf(props.activeObj);
        cropImageUtils.startCropping(props.canvas, props.canvasSetting, props.activeObj);
    };
    const confirmCropping = () => {
        props.setCroppingObj({});
        cropImageUtils.confirmCropping(props.canvas, props.activeObj, props.croppingObj, croppingObjIndex);
    };
    const cancelCropping = () => {
        props.setCroppingObj({});
        cropImageUtils.cancelCropping(props.canvas, props.activeObj, props.croppingObj, croppingObjIndex);
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
