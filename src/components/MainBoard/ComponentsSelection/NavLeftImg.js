import React from 'react';
import PropTypes from 'prop-types';
// import { fabric } from 'fabric';
import 'fabric-history';
import * as icons from '../../../icons.js';

const NavLeftImg = (props) => {
    const toggleImageAdjustmentNav = () => {
        props.setCurrentSidebar('imageAdjustment');
        const clickedOrNot = (e) => {
            const targetDiv = document.querySelector('.sidebarUnfold');
            if (!targetDiv.contains(e.target)) {
                props.setCurrentSidebar('');
                props.canvas.fire('object:modified');
                document.removeEventListener('click', clickedOrNot, true);
            }
        };
        document.addEventListener('click', clickedOrNot, true);
    };
    // render
    return (
        <div className='specificNav'>
            <div className={'specificButton'} onClick={toggleImageAdjustmentNav}>
                調整
            </div>
            <div className='specificButton'>剪裁</div>
            <div className='specificButton'>剪裁取消</div>
            <div className='specificButton'>剪裁完成</div>
        </div>
    );
};

NavLeftImg.propTypes = {
    currentSidebar: PropTypes.string.isRequired,
    setCurrentSidebar: PropTypes.func.isRequired,
    trackOutSideClick: PropTypes.func.isRequired,
    canvas: PropTypes.object.isRequired,
    activeObj: PropTypes.object.isRequired,
};

export default NavLeftImg;
