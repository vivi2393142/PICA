import React from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import 'fabric-history';
import * as icons from '../../../../img/icons';
import NavRightPartial from './NavRightPartial';
import NavLeftText from './NavLeftText';
import NavLeftImg from './NavLeftImg';
import NavLeftShape from './NavLeftShape';
import NavLeftColor from './NavLeftColor';

const ComponentsSelection = (props) => {
    const [clipboard, setClipboard] = React.useState(false);
    const [textIsEditing, setTextIsEditing] = React.useState(false);
    const [croppingObj, setCroppingObj] = React.useState({});

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
            let newClipBoard = clipboard;
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
        var sel = new fabric.ActiveSelection(props.canvas.getObjects(), {
            canvas: props.canvas,
        });
        props.canvas.setActiveObject(sel);
        props.canvas.requestRenderAll();
    };

    // keyboard functions
    React.useEffect(() => {
        // -- methods for component: onkeydown setting
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
        const keydownEvent = (e) => {
            if (e.keyCode === codes.ctrlKey || e.keyCode === codes.cmdKey) {
                ctrlDown = true;
            }
            if (e.keyCode === codes.shiftKey) {
                shiftDown = true;
            }
            if (ctrlDown && e.keyCode === codes.vKey) {
                pasteHandler();
            }
            if (props.activeObj.type) {
                if (ctrlDown && e.keyCode === codes.cKey) {
                    copyHandler();
                }
                if (ctrlDown && e.keyCode === codes.xKey) {
                    cutHandler();
                }
                if (e.keyCode === codes.delKey) {
                    if (
                        (props.activeObj.type === 'i-text' && props.activeObj.isEditing) ||
                        textIsEditing
                    ) {
                        return;
                    } else {
                        delHandler();
                    }
                }
            }
            if (ctrlDown && e.keyCode === codes.aKey) {
                e.preventDefault();
                selectAllHandler();
            }
            if (ctrlDown && e.keyCode === codes.zKey && !shiftDown) {
                //TODO: 待修正copy paste時復原的錯誤(因會紀錄不只一次紀錄)
                props.canvas.undo();
                props.setActiveObj({});
            }
            if (ctrlDown && shiftDown && e.keyCode === codes.zKey) {
                props.canvas.redo();
                props.setActiveObj({});
            }
        };
        const keyupEvent = (e) => {
            if (e.keyCode == codes.ctrlKey || e.keyCode == codes.cmdKey) {
                ctrlDown = false;
            }
            if (e.keyCode == codes.shiftKey) {
                shiftDown = false;
            }
        };
        // add new key function
        document.addEventListener('keydown', keydownEvent, false);
        document.addEventListener('keyup', keyupEvent, false);
        return () => {
            document.removeEventListener('keydown', keydownEvent, false);
            document.removeEventListener('keyup', keyupEvent, false);
        };
    }, [props.canvas, props.activeObj, clipboard, textIsEditing]);

    // render
    return (
        <div className='componentsSelection'>
            <div className='componentsNavLeft'>
                {(props.activeObj.type === 'rect' ||
                    props.activeObj.type === 'circle' ||
                    props.activeObj.type === 'triangle' ||
                    props.activeObj.type === 'path' ||
                    props.activeObj.type === 'polygon') &&
                props.activeObj.id !== 'cropbox' ? (
                    <NavLeftColor
                        canvas={props.canvas}
                        activeObj={props.activeObj}
                        trackOutSideClick={props.trackOutSideClick}
                    />
                ) : null}
                {(props.activeObj.type === 'image' || croppingObj !== {}) &&
                props.activeObj.id !== 'sticker' &&
                props.activeObj.id !== 'background' ? (
                    <NavLeftImg
                        currentSidebar={props.currentSidebar}
                        setCurrentSidebar={props.setCurrentSidebar}
                        setActiveObj={props.setActiveObj}
                        canvas={props.canvas}
                        trackOutSideClick={props.trackOutSideClick}
                        activeObj={props.activeObj}
                        croppingObj={croppingObj}
                        setCroppingObj={setCroppingObj}
                        canvasSetting={props.canvasSetting}
                    />
                ) : null}
                {props.activeObj.type === 'i-text' ? (
                    <NavLeftText
                        setTextIsEditing={setTextIsEditing}
                        canvas={props.canvas}
                        activeObj={props.activeObj}
                        trackOutSideClick={props.trackOutSideClick}
                    />
                ) : null}
                {(props.activeObj.type === 'rect' ||
                    props.activeObj.type === 'circle' ||
                    props.activeObj.type === 'triangle') &&
                props.activeObj.id !== 'cropbox' ? (
                    <NavLeftShape
                        trackOutSideClick={props.trackOutSideClick}
                        canvas={props.canvas}
                        activeObj={props.activeObj}
                    />
                ) : null}
            </div>
            {props.activeObj.id !== 'cropbox' ? (
                <div className='componentsNavRight'>
                    {props.activeObj.type ? (
                        <NavRightPartial
                            copyHandler={copyHandler}
                            cutHandler={cutHandler}
                            pasteHandler={pasteHandler}
                            delHandler={delHandler}
                            canvas={props.canvas}
                            activeObj={props.activeObj}
                            setActiveObj={props.setActiveObj}
                            trackOutSideClick={props.trackOutSideClick}
                        />
                    ) : null}
                    {clipboard ? (
                        <div className='paste'>
                            <icons.Paste className='activeButton' onClick={pasteHandler} />
                        </div>
                    ) : null}
                    {props.hasUndo ? (
                        <div className='undo'>
                            <icons.Undo
                                className='activeButton'
                                onClick={() => {
                                    props.canvas.undo();
                                    props.setActiveObj({});
                                }}
                            />
                        </div>
                    ) : null}
                    {props.hasRedo ? (
                        <div className='redo'>
                            <icons.Redo
                                className='activeButton'
                                onClick={() => {
                                    props.canvas.redo();
                                    props.setActiveObj({});
                                }}
                            />
                        </div>
                    ) : null}
                    {props.activeObj.id !== 'background' ? (
                        <div className='selectAll'>
                            <icons.SelectAll className='activeButton' onClick={selectAllHandler} />
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

ComponentsSelection.propTypes = {
    canvas: PropTypes.object.isRequired,
    setCanvas: PropTypes.func.isRequired,
    setActiveObj: PropTypes.func.isRequired,
    activeObj: PropTypes.object.isRequired,
    hasUndo: PropTypes.bool.isRequired,
    hasRedo: PropTypes.bool.isRequired,
    currentSidebar: PropTypes.string.isRequired,
    setCurrentSidebar: PropTypes.func.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    trackOutSideClick: PropTypes.func.isRequired,
};

export default ComponentsSelection;
