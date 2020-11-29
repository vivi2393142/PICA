import React from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import 'fabric-history';
import * as icons from '../../../icons.js';
import NavRightPartial from './NavRightPartial';
import NavLeftText from './NavLeftText';
import NavLeftImg from './NavLeftImg';
import NavLeftShape from './NavLeftShape';
import NavLeftColor from './NavLeftColor';

const ComponentsSelection = (props) => {
    const [clipboard, setClipboard] = React.useState(false);
    const [textIsEditing, setTextIsEditing] = React.useState(false);
    // state for components
    // -- track outside click event
    const trackOutSideClick = (childElement, callback) => {
        const clickedOrNot = (e) => {
            if (!childElement.parentNode.contains(e.target)) {
                callback();
                document.removeEventListener('click', clickedOrNot, true);
            }
        };
        document.addEventListener('click', clickedOrNot, true);
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
                {props.activeObj.type === 'i-text' ||
                props.activeObj.type === 'rect' ||
                props.activeObj.type === 'circle' ||
                props.activeObj.type === 'triangle' ? (
                    <NavLeftColor
                        canvas={props.canvas}
                        activeObj={props.activeObj}
                        trackOutSideClick={trackOutSideClick}
                    />
                ) : null}
                {props.activeObj.type === 'image' ? (
                    <NavLeftImg />
                ) : props.activeObj.type === 'i-text' ? (
                    <NavLeftText
                        setTextIsEditing={setTextIsEditing}
                        canvas={props.canvas}
                        activeObj={props.activeObj}
                        trackOutSideClick={trackOutSideClick}
                    />
                ) : props.activeObj.type === 'rect' ||
                  props.activeObj.type === 'circle' ||
                  props.activeObj.type === 'triangle' ? (
                    <NavLeftShape />
                ) : null}
            </div>
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
                        trackOutSideClick={trackOutSideClick}
                    />
                ) : null}
                {clipboard ? <icons.Paste className='activeButton' onClick={pasteHandler} /> : null}
                {props.hasUndo ? (
                    <icons.Undo
                        className='activeButton'
                        onClick={() => {
                            props.canvas.undo();
                            props.setActiveObj({});
                        }}
                    />
                ) : null}
                {props.hasRedo ? (
                    <icons.Redo
                        className='activeButton'
                        onClick={() => {
                            props.canvas.redo();
                            props.setActiveObj({});
                        }}
                    />
                ) : null}
                <icons.SelectAll className='activeButton' onClick={selectAllHandler} />
            </div>
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
};

export default ComponentsSelection;
