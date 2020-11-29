import React from 'react';
import PropTypes from 'prop-types';
// import { fabric } from 'fabric';
import 'fabric-history';
import * as icons from '../../../icons.js';

const NavLeftImg = (props) => {
    // render
    return (
        <div className='specificNav'>
            圖片選項
            <div className='specificButton'>剪裁</div>
            <div className='specificButton'>剪裁取消</div>
            <div className='specificButton'>剪裁完成</div>
        </div>
    );
};

NavLeftImg.propTypes = {};

export default NavLeftImg;
