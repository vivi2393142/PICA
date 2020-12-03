import React from 'react';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../img/banner';

const Banner = (props) => {
    return (
        <div className='banner'>
            <div className='logoWrapper'>
                <bannerIcons.Logo className='bannerLogo' />
            </div>
            <div className='bannerLeft'>
                <input value='未命名文件'></input>
                <div className='status'>已儲存</div>
            </div>
            <div className='bannerRight'>
                <bannerIcons.Resize className='bannerIcons' />
                <bannerIcons.Edit className='bannerIcons' />
                <bannerIcons.Share className='bannerIcons' />
                <bannerIcons.Download className='bannerIcons' />
                <bannerIcons.Member className='bannerIcons' />
            </div>
        </div>
    );
};

Banner.propTypes = {};

export default Banner;
