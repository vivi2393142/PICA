import React from 'react';
import PropTypes from 'prop-types';
import * as config from '../../../../utils/globalConfig';

const ImageFilters = (props) => {
    // get current image styles
    const [currentFilters, setCurrentFilters] = React.useState({
        ...config.imageFiltersInit,
    });
    React.useEffect(() => {
        if (props.activeObj.type === 'image') {
            props.activeObj.filters.forEach((item) => {
                const type = item.type.toLowerCase();
                type === 'huerotation'
                    ? (config.imageFiltersInit.rotation = parseFloat(item.rotation))
                    : (config.imageFiltersInit[type] = parseFloat(item[type]));
            });
            setCurrentFilters(config.imageFiltersInit);
        }
    }, [props.activeObj]);
    const resetFilters = () => {
        setCurrentFilters({
            ...config.imageFiltersInit,
        });
        props.activeObj.filters = [];
        props.activeObj.applyFilters();
        props.canvas.requestRenderAll();
    };

    // jsx: image adjustment
    const imageFiltersHandler = (e, item, index) => {
        const filters = fabric.Image.filters;
        const newFilters = { ...currentFilters };
        newFilters[item.attr] = parseFloat(e.target.value);
        setCurrentFilters(newFilters);
        const newFilter = new filters[item.way]({
            [item.attr]: parseFloat(e.target.value),
        });
        props.activeObj.filters[index] = newFilter;
        props.activeObj.applyFilters();
        props.canvas.requestRenderAll();
    };

    return (
        <div
            className='sidebarUnfoldInner unfoldImgAdjustment'
            style={{
                display: props.currentSidebar === 'imageAdjustment' ? 'flex' : 'none',
            }}
        >
            {config.imageFiltersSetting.map((item, index) => (
                <div key={index} className='imgAdjustBox'>
                    <div className='imgAdjustText'>{item.text}</div>
                    <input
                        className='imgAdjustRange'
                        type='range'
                        min={item.min}
                        max={item.max}
                        value={currentFilters[item.attr]}
                        onInput={(e) => imageFiltersHandler(e, item, index)}
                        step={item.step}
                    ></input>
                    <div className='imgAdjustValue'>{currentFilters[item.attr]}</div>
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
};

export default React.memo(ImageFilters);
