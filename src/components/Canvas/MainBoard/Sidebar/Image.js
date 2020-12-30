import React from 'react';
import PropTypes from 'prop-types';
import * as utils from '../../../../utils/globalUtils.js';
import * as config from '../../../../utils/globalConfig';

const Image = (props) => {
    return (
        <div
            className='sidebarUnfoldInner sidebarUnfoldImg'
            onMouseDown={(e) => props.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'image' ? 'flex' : 'none' }}
        >
            {config.imageArray.map((category, index) => {
                return (
                    <div className='unfoldImgWrapper unfoldImgWrapperToggle' key={index}>
                        <div className='toggleSubtitle'>
                            {category.title}
                            <div
                                onClick={(e) => {
                                    e.target.parentNode.parentNode.classList.toggle('unfoldImgWrapperToggle');
                                    e.target.textContent === '+'
                                        ? (e.target.textContent = '-')
                                        : (e.target.textContent = '+');
                                }}
                                className='toggleButton'
                            >
                                +
                            </div>
                        </div>
                        {category.src.map((item, index) => {
                            return (
                                <div key={index} className='unfoldItemGalleryWrapper'>
                                    <img
                                        onClick={(e) => {
                                            utils.addImage(
                                                e.target,
                                                props.nextAddPosition,
                                                props.canvas,
                                                props.canvasSetting
                                            );
                                            props.adjSetNextPosition();
                                        }}
                                        className='unfoldItem unfoldItemGallery'
                                        draggable={!props.isAtMobile}
                                        src={item}
                                        onLoad={(e) => {
                                            e.target.naturalHeight > e.target.naturalWidth
                                                ? (e.target.parentNode.style.width = '29%')
                                                : (e.target.parentNode.style.width = '58%');
                                        }}
                                    ></img>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

Image.propTypes = {
    canvas: PropTypes.object.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    currentSidebar: PropTypes.string.isRequired,
    saveDragItem: PropTypes.object.isRequired,
    isAtMobile: PropTypes.bool.isRequired,
    nextAddPosition: PropTypes.object.isRequired,
    adjSetNextPosition: PropTypes.func.isRequired,
};

export default React.memo(Image);
