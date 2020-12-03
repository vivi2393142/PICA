import React from 'react';
import PropTypes from 'prop-types';
import 'fabric-history';
import * as icons from '../../../img/icons';

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
        setIsLayerChoosing(false);
    };
    const upperHandler = () => {
        props.activeObj.bringForward();
        props.canvas.fire('object:modified');
        setIsLayerChoosing(false);
    };
    const toTopHandler = () => {
        props.activeObj.bringToFront();
        props.canvas.fire('object:modified');
        setIsLayerChoosing(false);
    };
    const toBottomHandler = () => {
        props.activeObj.sendToBack();
        props.canvas.fire('object:modified');
        setIsLayerChoosing(false);
    };
    // -- methods for component: group, ungroup, selectAll
    const groupHandler = (e) => {
        if (props.activeObj.type === 'activeSelection') {
            props.activeObj.toGroup();
            props.canvas.requestRenderAll();
            props.setActiveObj(props.canvas.getActiveObject());
        }
    };
    const ungroupHandler = () => {
        if (props.activeObj.type === 'group') {
            props.activeObj.toActiveSelection();
            props.canvas.requestRenderAll();
            props.setActiveObj(props.canvas.getActiveObject());
        }
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
        props.canvas.requestRenderAll();
        // trigger 'object:modified' event
        props.canvas.fire('object:modified', { target: props.activeObj });
        setIsAlignChoosing(false);
    };
    return (
        <div className='componentsNavRightPartial'>
            {props.activeObj.type === 'activeSelection' ? (
                <icons.Group className='activeButton' onClick={groupHandler} />
            ) : null}
            {props.activeObj.type === 'group' ? (
                <icons.Ungroup className='activeButton' onClick={ungroupHandler} />
            ) : null}
            <icons.TrashCan className='activeButton' onClick={props.delHandler} />
            {props.activeObj.id !== 'background' ? (
                <div className='layer'>
                    <icons.Layer className='activeButton' onClick={toggleLayerSelection} />
                    {isLayerChoosing ? (
                        <div className='layerChoosingBox'>
                            <icons.ToBottom className='activeButton' onClick={toBottomHandler} />
                            <icons.ToTop className='activeButton' onClick={toTopHandler} />
                            <icons.Upper className='activeButton' onClick={upperHandler} />
                            <icons.Downer className='activeButton' onClick={downerHandler} />
                        </div>
                    ) : null}
                </div>
            ) : null}
            {props.activeObj.id !== 'background' ? (
                <div className='align'>
                    <icons.Align className='activeButton' onClick={toggleAlignSelection} />
                    {isAlignChoosing ? (
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
                    ) : null}
                </div>
            ) : null}
            {props.activeObj.id !== 'background' ? (
                <icons.Copy className='activeButton' onClick={props.copyHandler} />
            ) : null}
            {props.activeObj.id !== 'background' ? (
                <icons.Cut className='activeButton' onClick={props.cutHandler} />
            ) : null}
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
