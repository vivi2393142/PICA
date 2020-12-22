import React from 'react';
import PropTypes from 'prop-types';
import 'fabric-history';
import * as icons from '../../../../img/icons';

const NavRightPartial = (props) => {
    // unfold nav
    const [isLayerChoosing, setIsLayerChoosing] = React.useState(false);
    const toggleLayerSelection = (e) => {
        setIsLayerChoosing(true);
        props.trackOutSideClick(e.currentTarget, () => {
            setIsLayerChoosing(false);
        });
    };
    const [isAlignChoosing, setIsAlignChoosing] = React.useState(false);
    const toggleAlignSelection = (e) => {
        setIsAlignChoosing(true);
        props.trackOutSideClick(e.currentTarget, () => {
            setIsAlignChoosing(false);
        });
    };
    // methods for component:
    // -- methods for component: sendBackwards, sendToBack, bringForward, bringToFront
    const downerHandler = () => {
        props.activeObj.sendBackwards();
        props.canvas.fire('object:modified');
        props.canvas.requestRenderAll();
        setIsLayerChoosing(false);
    };
    const upperHandler = () => {
        props.activeObj.bringForward();
        props.canvas.fire('object:modified');
        props.canvas.requestRenderAll();
        setIsLayerChoosing(false);
    };
    const toTopHandler = () => {
        props.activeObj.bringToFront();
        props.canvas.fire('object:modified');
        props.canvas.requestRenderAll();
        setIsLayerChoosing(false);
    };
    const toBottomHandler = () => {
        props.activeObj.sendToBack();
        props.canvas.fire('object:modified');
        props.canvas.requestRenderAll();
        setIsLayerChoosing(false);
    };
    // -- methods for component: group, ungroup, selectAll
    const groupHandler = (e) => {
        props.canvas.offHistory();
        if (props.activeObj.type === 'activeSelection') {
            props.activeObj.toGroup();
            props.canvas.requestRenderAll();
            props.setActiveObj(props.canvas.getActiveObject());
        }
        props.canvas.onHistory();
    };
    const ungroupHandler = () => {
        props.canvas.offHistory();
        if (props.activeObj.type === 'group') {
            props.activeObj.toActiveSelection();
            props.canvas.requestRenderAll();
            props.setActiveObj(props.canvas.getActiveObject());
        }
        props.canvas.onHistory();
    };

    // -- methods for component: align components
    const alignHandler = (side) => {
        // const activeObj = props.canvas.getActiveObject();
        const groupWidth = props.activeObj.getBoundingRect().width;
        const groupHeight = props.activeObj.getBoundingRect().height;
        switch (side) {
            case 'left':
                if (props.activeObj.type === 'activeSelection') {
                    props.canvas.getActiveObjects().forEach((obj) => {
                        obj.set({
                            left: -(groupWidth / 2),
                            originX: 'left',
                        });
                    });
                } else {
                    props.activeObj.set({
                        left: 0,
                        originX: 'left',
                    });
                }
                break;
            case 'right':
                if (props.activeObj.type === 'activeSelection') {
                    props.canvas.getActiveObjects().forEach((obj) => {
                        const itemWidth = obj.getBoundingRect().width;
                        obj.set({
                            left: groupWidth / 2 - itemWidth / 2,
                            originX: 'center',
                        });
                    });
                } else {
                    props.activeObj.set({
                        left: props.canvas.width - props.activeObj.width * props.activeObj.scaleX,
                        originX: 'left',
                    });
                }
                break;
            case 'top':
                if (props.activeObj.type === 'activeSelection') {
                    props.canvas.getActiveObjects().forEach((obj) => {
                        obj.set({
                            top: -(groupHeight / 2),
                            originY: 'top',
                        });
                    });
                } else {
                    props.activeObj.set({
                        top: 0,
                        originY: 'top',
                    });
                }
                break;
            case 'bottom':
                if (props.activeObj.type === 'activeSelection') {
                    props.canvas.getActiveObjects().forEach((obj) => {
                        const itemHeight = obj.getBoundingRect().height;
                        obj.set({
                            top: groupHeight / 2 - itemHeight / 2,
                            originY: 'center',
                        });
                    });
                } else {
                    props.activeObj.set({
                        top: props.canvas.height - props.activeObj.height * props.activeObj.scaleY,
                        originY: 'top',
                    });
                }
                break;
            case 'horizonCenter':
                if (props.activeObj.type === 'activeSelection') {
                    props.canvas.getActiveObjects().forEach((obj) => {
                        obj.set({
                            left: 0,
                            originX: 'center',
                        });
                    });
                } else {
                    props.activeObj.set({
                        left: props.canvas.width / 2,
                        originX: 'center',
                    });
                }
                break;
            case 'verticalCenter':
                if (props.activeObj.type === 'activeSelection') {
                    props.canvas.getActiveObjects().forEach((obj) => {
                        obj.set({
                            top: 0,
                            originY: 'center',
                        });
                    });
                } else {
                    props.activeObj.set({
                        top: props.canvas.height / 2,
                        originY: 'center',
                    });
                }
                break;
        }
        // trigger 'object:modified' event
        props.canvas.fire('object:modified', { target: props.activeObj });
        // props.canvas.fire('object:modified');
        props.canvas.requestRenderAll();
        setIsAlignChoosing(false);
    };
    return (
        <div className='componentsNavRightPartial'>
            {props.activeObj.type === 'activeSelection' && (
                <icons.Group className='activeButton' onClick={groupHandler} />
            )}
            {props.activeObj.type === 'group' && (
                <icons.Ungroup className='activeButton' onClick={ungroupHandler} />
            )}
            <div className='trashCan'>
                <icons.TrashCan className='activeButton' onClick={props.delHandler} />
            </div>
            {props.activeObj.specialType !== 'background' && (
                <div className='layer'>
                    <icons.Layer className='activeButton' onClick={toggleLayerSelection} />
                    {isLayerChoosing && (
                        <div className='layerChoosingBox'>
                            <icons.ToBottom className='activeButton' onClick={toBottomHandler} />
                            <icons.ToTop className='activeButton' onClick={toTopHandler} />
                            <icons.Upper className='activeButton' onClick={upperHandler} />
                            <icons.Downer className='activeButton' onClick={downerHandler} />
                        </div>
                    )}
                </div>
            )}
            {props.activeObj.specialType !== 'background' && (
                <div className='align'>
                    <icons.Align className='activeButton' onClick={toggleAlignSelection} />
                    {isAlignChoosing && (
                        <div className='alignChoosingBox'>
                            <icons.AlignCenterH
                                className='activeButton'
                                onClick={() => alignHandler('horizonCenter')}
                            />
                            <icons.AlignCenterV
                                className='activeButton'
                                onClick={() => alignHandler('verticalCenter')}
                            />
                            <icons.AlignLeft
                                className='activeButton'
                                onClick={() => alignHandler('left')}
                            />
                            <icons.AlignRight
                                className='activeButton'
                                onClick={() => alignHandler('right')}
                            />
                            <icons.AlignTop
                                className='activeButton'
                                onClick={() => alignHandler('top')}
                            />
                            <icons.AlignBottom
                                className='activeButton'
                                onClick={() => alignHandler('bottom')}
                            />
                        </div>
                    )}
                </div>
            )}
            {props.activeObj.specialType !== 'background' && (
                <div className='copy'>
                    <icons.Copy className='activeButton' onClick={props.copyHandler} />
                </div>
            )}
            {props.activeObj.specialType !== 'background' && (
                <div className='cut'>
                    <icons.Cut className='activeButton' onClick={props.cutHandler} />{' '}
                </div>
            )}
        </div>
    );
};

NavRightPartial.propTypes = {
    copyHandler: PropTypes.func.isRequired,
    cutHandler: PropTypes.func.isRequired,
    pasteHandler: PropTypes.func.isRequired,
    delHandler: PropTypes.func.isRequired,
    activeObj: PropTypes.object.isRequired,
    setActiveObj: PropTypes.func.isRequired,
    canvas: PropTypes.object.isRequired,
    trackOutSideClick: PropTypes.func.isRequired,
};

export default NavRightPartial;
