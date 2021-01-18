import { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import * as config from '../../../../utils/globalConfig';
import { trackOutSideClick } from '../../../../utils/globalUtils.js';

const getCurrentFilters = (imageObj) => {
    const newFilters = { ...config.imageFiltersInit };
    imageObj.filters.forEach((filter) => {
        const type = filter.type.toLowerCase();
        type === 'huerotation'
            ? (newFilters.rotation = parseFloat(filter.rotation))
            : (newFilters[type] = parseFloat(filter[type]));
    });
    return newFilters;
};

const ImageFilters = (props) => {
    const sidebarRef = useRef(null);
    const [currentFilters, setCurrentFilters] = useState({
        ...config.imageFiltersInit,
    });
    useEffect(() => {
        props.activeObj.type === 'image' && setCurrentFilters(getCurrentFilters(props.activeObj));
    }, [props.activeObj]);
    useEffect(() => {
        trackOutSideClick(sidebarRef.current, () => {
            if (props.currentSidebar === 'imageAdjustment') {
                props.setCurrentSidebar('');
                props.canvas.fire('object:modified');
            }
        });
    }, [props.currentSidebar]);

    const resetFilters = () => {
        setCurrentFilters({
            ...config.imageFiltersInit,
        });
        props.activeObj.filters = [];
        props.activeObj.applyFilters();
        props.canvas.requestRenderAll();
    };
    const setImageFiltersRangeInput = (newValue, filter) => {
        const newFilters = { ...currentFilters };
        newFilters[filter.attr] = parseFloat(newValue);
        setCurrentFilters(newFilters);
    };
    const renderNewImageFilters = (newValue, filter, index) => {
        const filters = fabric.Image.filters;
        const newFilter = new filters[filter.way]({
            [filter.attr]: parseFloat(newValue),
        });
        props.activeObj.filters[index] = newFilter;
        props.activeObj.applyFilters();
        props.canvas.requestRenderAll();
    };
    const imageFiltersHandler = (newValue, filter, index) => {
        setImageFiltersRangeInput(newValue, filter);
        renderNewImageFilters(newValue, filter, index);
    };

    return (
        <div
            ref={sidebarRef}
            className='sidebarUnfoldInner unfoldImgAdjustment'
            style={{
                display: props.currentSidebar === 'imageAdjustment' ? 'flex' : 'none',
            }}
        >
            {config.imageFiltersSetting.map((filter, index) => (
                <div key={filter.text} className='imgAdjustBox'>
                    <div className='imgAdjustText'>{filter.text}</div>
                    <input
                        className='imgAdjustRange'
                        type='range'
                        min={filter.min}
                        max={filter.max}
                        value={currentFilters[filter.attr]}
                        onInput={(e) => imageFiltersHandler(e.target.value, filter, index)}
                        step={filter.step}
                    ></input>
                    <div className='imgAdjustValue'>{currentFilters[filter.attr]}</div>
                </div>
            ))}
            <div className='resetFilterButton' onClick={resetFilters}>
                重設圖片
            </div>
        </div>
    );
};

ImageFilters.propTypes = {
    canvas: PropTypes.object.isRequired,
    activeObj: PropTypes.object.isRequired,
    currentSidebar: PropTypes.string.isRequired,
    setCurrentSidebar: PropTypes.func.isRequired,
};

export default memo(ImageFilters);
