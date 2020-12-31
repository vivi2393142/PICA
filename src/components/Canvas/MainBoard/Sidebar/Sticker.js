import React from 'react';
import PropTypes from 'prop-types';
import * as utils from '../../../../utils/globalUtils.js';
import * as config from '../../../../utils/globalConfig';

const Sticker = (props) => {
    return (
        <div
            className='sidebarUnfoldInner sidebarUnfoldSticker'
            onMouseDown={(e) => props.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'sticker' ? 'flex' : 'none' }}
        >
            {config.stickerTestArray.map((category, index) => {
                return (
                    <div
                        className='unfoldImgWrapper unfoldImgWrapperToggle'
                        key={index}
                        style={{ width: props.isAtMobile ? 'auto' : '' }}
                    >
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
                                            utils.addSticker(
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
                                            e.target.parentNode.style.width =
                                                e.target.naturalHeight > e.target.naturalWidth
                                                    ? config.stickerWidthForWaterfall.narrow
                                                    : config.stickerWidthForWaterfall.wide;
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

Sticker.propTypes = {
    canvas: PropTypes.object.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    currentSidebar: PropTypes.string.isRequired,
    saveDragItem: PropTypes.object.isRequired,
    isAtMobile: PropTypes.bool.isRequired,
    nextAddPosition: PropTypes.object.isRequired,
    adjSetNextPosition: PropTypes.func.isRequired,
};

export default React.memo(Sticker);
