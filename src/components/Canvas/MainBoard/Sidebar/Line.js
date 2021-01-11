import React from 'react';
import PropTypes from 'prop-types';
import * as utils from '../../../../utils/globalUtils.js';
import * as config from '../../../../utils/globalConfig';

const Line = (props) => {
    return (
        <div
            className='sidebarUnfoldInner sidebarUnfoldLine'
            onMouseDown={(e) => props.saveDragItem.func(e)}
            style={{ display: props.currentSidebar === 'line' ? 'flex' : 'none' }}
        >
            {config.lineArray.map((item) => {
                return (
                    <img
                        key={item}
                        src={item}
                        className='unfoldItem itemLine'
                        onClick={(e) => {
                            utils.addShape(
                                e.target.src,
                                props.nextAddPosition,
                                props.canvas,
                                props.canvasSetting
                            );
                            props.adjSetNextPosition();
                        }}
                        draggable={!props.isAtMobile}
                    ></img>
                );
            })}
        </div>
    );
};

Line.propTypes = {
    canvas: PropTypes.object.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    currentSidebar: PropTypes.string.isRequired,
    saveDragItem: PropTypes.object.isRequired,
    isAtMobile: PropTypes.bool.isRequired,
    nextAddPosition: PropTypes.object.isRequired,
    adjSetNextPosition: PropTypes.func.isRequired,
};

export default React.memo(Line);
