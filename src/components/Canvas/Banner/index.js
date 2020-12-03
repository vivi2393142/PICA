import React from 'react';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../../img/banner';
import Resize from './Resize';
import Export from './Export';

const Banner = (props) => {
    const allSettings = props.drawingAreaSettings;
    // title setting
    const handleTitle = (e) => {
        const newCanvasSetting = { ...allSettings.canvasSetting, title: e.target.value };
        allSettings.setCanvasSetting(newCanvasSetting);
    };

    return (
        <div className='banner'>
            <div className='logoWrapper'>
                <bannerIcons.Logo className='bannerLogo' />
            </div>
            <div className='bannerLeft'>
                <input
                    placeholder='未命名文件'
                    value={allSettings.canvasSetting.title}
                    onChange={handleTitle}
                ></input>
                <div className='statusSize'>{`${allSettings.canvasSetting.width}×${allSettings.canvasSetting.height}像素`}</div>
                <div className='status'>已儲存</div>
            </div>
            <div className='bannerRight'>
                <Resize drawingAreaSettings={allSettings} />
                <div className='shareIconWrapper'>
                    <bannerIcons.Share className='bannerIcons' />
                </div>
                <Export drawingAreaSettings={allSettings} />
                <div className='memberIconWrapper'>
                    <bannerIcons.Member className='bannerIcons' />
                </div>
            </div>
        </div>
    );
};

Banner.propTypes = {
    // TODO: 待資料確定後，明確定義 array 內容
    drawingAreaSettings: PropTypes.object.isRequired,
};

export default Banner;
