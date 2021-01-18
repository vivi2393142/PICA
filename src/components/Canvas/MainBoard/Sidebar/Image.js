import { memo } from 'react';
import PropTypes from 'prop-types';
import * as utils from '../../../../utils/globalUtils.js';
import * as config from '../../../../utils/globalConfig';

const Image = (props) => {
    const singleImage = (imageSrc) => {
        return (
            <div className='unfoldItemGalleryWrapper' key={imageSrc}>
                <img
                    onClick={(e) => {
                        utils.addImage(e.target, props.nextAddPosition, props.canvas, props.canvasSetting);
                        props.adjSetNextPosition();
                    }}
                    className='unfoldItem unfoldItemGallery'
                    draggable={!props.isAtMobile}
                    src={imageSrc}
                    onLoad={(e) => {
                        e.target.parentNode.style.width =
                            e.target.naturalHeight > e.target.naturalWidth
                                ? config.imageWidthForWaterfall.narrow
                                : config.imageWidthForWaterfall.wide;
                    }}
                ></img>
            </div>
        );
    };
    const imagesInCategory = (category) =>
        category.src.map((imageSrc, index) => singleImage(imageSrc, index));

    const singleCategory = (category) => {
        return (
            <div className='unfoldImgWrapper unfoldImgWrapperToggle' key={category.title}>
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
                {imagesInCategory(category)}
            </div>
        );
    };
    const allCategoryJsx = config.imageArray.map((category, index) => singleCategory(category, index));

    return (
        <div
            className='sidebarUnfoldInner sidebarUnfoldImg'
            onMouseDown={(e) => props.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'image' ? 'flex' : 'none' }}
        >
            {allCategoryJsx}
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

export default memo(Image);
