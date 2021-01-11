import React from 'react';
import PropTypes from 'prop-types';
import * as sidebarItems from '../../../../img/sidebarItems';
import * as utils from '../../../../utils/globalUtils.js';
import * as config from '../../../../utils/globalConfig';

const Shape = (props) => {
    const normalShapeJsx = config.normalShapeSetting.map((option) => (
        <img
            key={option.type}
            src={sidebarItems[option.type]}
            className={`unfoldItem ${option.className}`}
            draggable={!props.isAtMobile}
            onClick={() => {
                utils[option.callbackName](props.nextAddPosition, props.canvas, props.canvasSetting);
                props.adjSetNextPosition();
            }}
        ></img>
    ));
    const abnormalShapeJsx = config.abnormalShapeArray.map((item) => (
        <img
            key={item}
            src={item}
            draggable={!props.isAtMobile}
            className='unfoldItem abnormalShape'
            onClick={(e) => {
                utils.addShape(e.target.src, props.nextAddPosition, props.canvas, props.canvasSetting);
                props.adjSetNextPosition();
            }}
        ></img>
    ));

    return (
        <div
            className='sidebarUnfoldInner sidebarUnfoldShape'
            onMouseDown={(e) => props.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'shape' ? 'flex' : 'none' }}
        >
            <div className='sidebarUnfoldSubtitle'>常用形狀</div>
            {normalShapeJsx}
            <div className='sidebarUnfoldSubtitle'>不規則形狀</div>
            {abnormalShapeJsx}
        </div>
    );
};

Shape.propTypes = {
    canvas: PropTypes.object.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    currentSidebar: PropTypes.string.isRequired,
    saveDragItem: PropTypes.object.isRequired,
    isAtMobile: PropTypes.bool.isRequired,
    nextAddPosition: PropTypes.object.isRequired,
    adjSetNextPosition: PropTypes.func.isRequired,
};

export default React.memo(Shape);
