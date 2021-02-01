import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import 'fabric-history';
import * as icons from '../../../../img/icons';
import { trackOutSideClick } from '../../../../utils/globalUtils.js';

let ctrlDown = false;
let shiftDown = false;
const codes = {
    ctrlKey: 17,
    cmdKey: 91,
    delKey: 8,
    shiftKey: 16,
    vKey: 86,
    xKey: 88,
    cKey: 67,
    aKey: 65,
    zKey: 90,
};
const isNeedOption = (option, activeObj, canvas, canvasData) => {
    switch (option) {
        case 'group':
            return activeObj.type === 'activeSelection';
        case 'ungroup':
            return activeObj.type === 'group';
        case 'trashcan':
            return activeObj.type;
        case 'layer':
        case 'align':
        case 'copy':
        case 'cut':
            return activeObj.specialType !== 'background' && activeObj.type;
        case 'undo':
            return canvas.historyUndo && canvas.historyUndo.length !== 0;
        case 'redo':
            return canvas.historyRedo && canvas.historyRedo.length !== 0;
        case 'selectAll':
            return (
                activeObj.specialType !== 'background' &&
                canvasData.objects &&
                canvasData.objects.length !== 0
            );
        case 'discard':
            return (
                activeObj.specialType !== 'background' &&
                canvasData.objects &&
                canvasData.objects.length !== 0 &&
                Object.keys(activeObj).length !== 0
            );
        default:
            break;
    }
};

const NavRight = (props) => {
    // unfold nav
    const [clipboard, setClipboard] = useState(false);
    const [isLayerChoosing, setIsLayerChoosing] = useState(false);
    const [isAlignChoosing, setIsAlignChoosing] = useState(false);
    const toggleSelectionHandler = (e, setSelectedState) => {
        setSelectedState(true);
        props.setShowMobileScrollContainer(true);
        trackOutSideClick(e.currentTarget.parentNode, () => {
            setSelectedState(false);
            props.setShowMobileScrollContainer(false);
        });
    };
    const toggleLayerSelection = (e) => {
        toggleSelectionHandler(e, setIsLayerChoosing);
    };
    const toggleAlignSelection = (e) => {
        toggleSelectionHandler(e, setIsAlignChoosing);
    };

    // methods for component:
    // -- methods for component: copy, cut, paste, delete
    const copyHandler = () => {
        props.activeObj.clone(function (cloned) {
            setClipboard(cloned);
        });
    };
    const cutHandler = () => {
        props.activeObj.clone(function (cloned) {
            setClipboard(cloned);
            const activeObject = props.canvas.getActiveObjects();
            props.canvas.remove(...activeObject);
            props.canvas.discardActiveObject();
        });
    };
    const pasteHandler = () => {
        if (clipboard === false) {
            return;
        }
        clipboard.clone(function (clonedObj) {
            props.canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                // active selection needs a reference to the canvas.
                clonedObj.canvas = props.canvas;
                clonedObj.forEachObject(function (obj) {
                    props.canvas.add(obj);
                });
                // this should solve the unselect ability
                clonedObj.setCoords();
            } else {
                props.canvas.add(clonedObj);
            }
            const newClipBoard = clipboard;
            newClipBoard.top += 10;
            newClipBoard.left += 10;
            setClipboard(newClipBoard);
            props.canvas.setActiveObject(clonedObj);
            props.canvas.requestRenderAll();
        });
    };
    const delHandler = () => {
        const activeObject = props.canvas.getActiveObjects();
        props.canvas.remove(...activeObject);
        props.canvas.discardActiveObject();
    };
    // -- methods for component: select all
    const selectAllHandler = () => {
        props.canvas.discardActiveObject();
        const sel = new fabric.ActiveSelection(props.canvas.getObjects(), {
            canvas: props.canvas,
        });
        props.canvas.setActiveObject(sel);
        props.canvas.requestRenderAll();
    };
    const discardHandler = () => {
        props.canvas.discardActiveObject();
        props.canvas.requestRenderAll();
    };

    // keyboard functions
    // -- methods for component: onkeydown setting
    onkeydown = (e) => {
        if (e.keyCode === codes.ctrlKey || e.keyCode === codes.cmdKey) {
            ctrlDown = true;
        }
        if (e.keyCode === codes.shiftKey) {
            shiftDown = true;
        }
        if (ctrlDown && e.keyCode === codes.vKey && !props.isFocusInput) {
            pasteHandler();
        }
        if (props.activeObj.type) {
            ctrlDown && e.keyCode === codes.cKey && !props.isFocusInput && copyHandler();
            ctrlDown && e.keyCode === codes.xKey && !props.isFocusInput && cutHandler();
            if (e.keyCode === codes.delKey && !props.isFocusInput) {
                if (
                    (props.activeObj.type === 'i-text' && props.activeObj.isEditing) ||
                    props.textIsEditing
                ) {
                    return;
                } else {
                    delHandler();
                }
            }
        }
        if (ctrlDown && e.keyCode === codes.aKey && !props.isFocusInput) {
            e.preventDefault();
            selectAllHandler();
        }
        if (ctrlDown && e.keyCode === codes.zKey && !shiftDown) {
            props.canvas.undo();
            props.setActiveObj({});
        }
        if (ctrlDown && shiftDown && e.keyCode === codes.zKey) {
            props.canvas.redo();
            props.setActiveObj({});
        }
    };
    onkeyup = (e) => {
        if (e.keyCode == codes.ctrlKey || e.keyCode == codes.cmdKey) {
            ctrlDown = false;
        }
        if (e.keyCode == codes.shiftKey) {
            shiftDown = false;
        }
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
                        left:
                            props.canvasSetting.width -
                            props.activeObj.width * props.activeObj.scaleX,
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
                        top:
                            props.canvasSetting.height -
                            props.activeObj.height * props.activeObj.scaleY,
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
                        left: props.canvasSetting.width / 2,
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
                        top: props.canvasSetting.height / 2,
                        originY: 'center',
                    });
                }
                break;
        }
        // trigger 'object:modified' event
        props.canvas.fire('object:modified', { target: props.activeObj });
        props.canvas.requestRenderAll();
        setIsAlignChoosing(false);
    };

    return (
        <div className='componentsNavRight'>
            {isNeedOption('group', props.activeObj) && (
                <icons.Group className='activeButton' onClick={groupHandler} />
            )}
            {isNeedOption('ungroup', props.activeObj) && (
                <icons.Ungroup className='activeButton' onClick={ungroupHandler} />
            )}
            {isNeedOption('trashcan', props.activeObj) && (
                <div className='trashCan activeButton'>
                    <icons.TrashCan onClick={delHandler} />
                </div>
            )}
            {isNeedOption('layer', props.activeObj) && (
                <div className='layer activeButton'>
                    <icons.Layer onClick={toggleLayerSelection} className='insideButton' />
                    {isLayerChoosing && (
                        <div className='layerChoosingBox'>
                            <icons.ToBottom
                                className='activeButton insideButton'
                                onClick={toBottomHandler}
                            />
                            <icons.ToTop
                                className='activeButton insideButton'
                                onClick={toTopHandler}
                            />
                            <icons.Upper
                                className='activeButton insideButton'
                                onClick={upperHandler}
                            />
                            <icons.Downer
                                className='activeButton insideButton'
                                onClick={downerHandler}
                            />
                        </div>
                    )}
                </div>
            )}
            {isNeedOption('align', props.activeObj) && (
                <div className='align activeButton'>
                    <icons.Align onClick={toggleAlignSelection} className='insideButton' />
                    {isAlignChoosing && (
                        <div className='alignChoosingBox'>
                            <icons.AlignCenterH
                                className='activeButton insideButton'
                                onClick={() => alignHandler('horizonCenter')}
                            />
                            <icons.AlignCenterV
                                className='activeButton insideButton'
                                onClick={() => alignHandler('verticalCenter')}
                            />
                            <icons.AlignLeft
                                className='activeButton insideButton'
                                onClick={() => alignHandler('left')}
                            />
                            <icons.AlignRight
                                className='activeButton insideButton'
                                onClick={() => alignHandler('right')}
                            />
                            <icons.AlignTop
                                className='activeButton insideButton'
                                onClick={() => alignHandler('top')}
                            />
                            <icons.AlignBottom
                                className='activeButton insideButton'
                                onClick={() => alignHandler('bottom')}
                            />
                        </div>
                    )}
                </div>
            )}
            {isNeedOption('copy', props.activeObj) && (
                <div className='copy activeButton'>
                    <icons.Copy onClick={copyHandler} />
                </div>
            )}
            {isNeedOption('cut', props.activeObj) && (
                <div className='cut activeButton'>
                    <icons.Cut onClick={cutHandler} />
                </div>
            )}
            {clipboard && (
                <div className='paste activeButton'>
                    <icons.Paste onClick={pasteHandler} />
                </div>
            )}
            {isNeedOption('undo', props.activeObj, props.canvas) && (
                <div className='undo activeButton'>
                    <icons.Undo
                        onClick={() => {
                            props.canvas.undo();
                            props.setActiveObj({});
                        }}
                    />
                </div>
            )}
            {isNeedOption('redo', props.activeObj, props.canvas) && (
                <div className='redo activeButton'>
                    <icons.Redo
                        onClick={() => {
                            props.canvas.redo();
                            props.setActiveObj({});
                        }}
                    />
                </div>
            )}
            {isNeedOption('selectAll', props.activeObj, props.canvas, props.canvasData) && (
                <div className='selectAll activeButton'>
                    <icons.SelectAll onClick={selectAllHandler} />
                </div>
            )}
            {isNeedOption('discard', props.activeObj, props.canvas, props.canvasData) && (
                <div className='selectAll activeButton'>
                    <icons.Discard onClick={discardHandler} />
                </div>
            )}
        </div>
    );
};

NavRight.propTypes = {
    activeObj: PropTypes.object.isRequired,
    setActiveObj: PropTypes.func.isRequired,
    canvas: PropTypes.object.isRequired,
    canvasData: PropTypes.object.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    textIsEditing: PropTypes.bool.isRequired,
    isFocusInput: PropTypes.bool.isRequired,
    setShowMobileScrollContainer: PropTypes.func.isRequired,
};

export default memo(NavRight);
