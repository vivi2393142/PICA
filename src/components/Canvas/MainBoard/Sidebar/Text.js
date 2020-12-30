import React from 'react';
import PropTypes from 'prop-types';
import * as utils from '../../../../utils/globalUtils.js';
import * as config from '../../../../utils/globalConfig';

const Text = (props) => {
    return (
        <div
            className='sidebarUnfoldInner sidebarUnfoldText'
            style={{ display: props.currentSidebar === 'text' ? 'flex' : 'none' }}
            onMouseDown={(e) => props.saveDragItem.func(e)}
        >
            {config.textSetting.map((option, index) => (
                <div
                    key={option.className}
                    draggable={!props.isAtMobile}
                    className={`unfoldItem ${option.className}`}
                    onClick={() => {
                        utils.addIText(props.nextAddPosition, props.canvas, props.canvasSetting, index);
                        props.adjSetNextPosition();
                    }}
                >
                    {option.content}
                </div>
            ))}
        </div>
    );
};

Text.propTypes = {
    canvas: PropTypes.object.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    currentSidebar: PropTypes.string.isRequired,
    saveDragItem: PropTypes.object.isRequired,
    isAtMobile: PropTypes.bool.isRequired,
    nextAddPosition: PropTypes.object.isRequired,
    adjSetNextPosition: PropTypes.func.isRequired,
};

export default React.memo(Text);
