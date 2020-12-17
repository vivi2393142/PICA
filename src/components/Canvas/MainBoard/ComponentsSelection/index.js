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
    const allSettings = props.allSettings;

    const [clipboard, setClipboard] = React.useState(false);
    const [textIsEditing, setTextIsEditing] = React.useState(false);
    const [croppingObj, setCroppingObj] = React.useState({});

    // methods for component:
    // -- methods for component: copy, cut, paste, delete
    const copyHandler = () => {
        allSettings.activeObj.clone(function (cloned) {
            setClipboard(cloned);
        });
    };
    const cutHandler = () => {
        allSettings.activeObj.clone(function (cloned) {
            setClipboard(cloned);
            const activeObject = allSettings.canvas.getActiveObjects();
            allSettings.canvas.remove(...activeObject);
            allSettings.canvas.discardActiveObject();
        });
    };
    const pasteHandler = () => {
        if (clipboard === false) {
            return;
        }
        clipboard.clone(function (clonedObj) {
            allSettings.canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });
            if (clonedObj.type === 'activeSelection') {
                // active selection needs a reference to the canvas.
                clonedObj.canvas = allSettings.canvas;
                clonedObj.forEachObject(function (obj) {
                    allSettings.canvas.add(obj);
                });
                // this should solve the unselect ability
                clonedObj.setCoords();
            } else {
                allSettings.canvas.add(clonedObj);
            }
            let newClipBoard = clipboard;
            newClipBoard.top += 10;
            newClipBoard.left += 10;
            setClipboard(newClipBoard);
            allSettings.canvas.setActiveObject(clonedObj);
            allSettings.canvas.requestRenderAll();
        });
    };
    const delHandler = () => {
        const activeObject = allSettings.canvas.getActiveObjects();
        allSettings.canvas.remove(...activeObject);
        allSettings.canvas.discardActiveObject();
    };
    // -- methods for component: select all
    const selectAllHandler = () => {
        allSettings.canvas.discardActiveObject();
        var sel = new fabric.ActiveSelection(allSettings.canvas.getObjects(), {
            canvas: allSettings.canvas,
        });
        allSettings.canvas.setActiveObject(sel);
        allSettings.canvas.requestRenderAll();
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
            if (allSettings.activeObj.type) {
                if (ctrlDown && e.keyCode === codes.cKey) {
                    copyHandler();
                }
                if (ctrlDown && e.keyCode === codes.xKey) {
                    cutHandler();
                }
                if (e.keyCode === codes.delKey) {
                    if (
                        (allSettings.activeObj.type === 'i-text' &&
                            allSettings.activeObj.isEditing) ||
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
                allSettings.canvas.undo();
                allSettings.setActiveObj({});
            }
            if (ctrlDown && shiftDown && e.keyCode === codes.zKey) {
                allSettings.canvas.redo();
                allSettings.setActiveObj({});
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
    }, [allSettings.canvas, allSettings.activeObj, clipboard, textIsEditing]);

    // render
    return (
        <div className='componentsSelection'>
            <div className='componentsNavLeft'>
                {(allSettings.activeObj.type === 'rect' ||
                    allSettings.activeObj.type === 'circle' ||
                    allSettings.activeObj.type === 'triangle' ||
                    allSettings.activeObj.type === 'path' ||
                    allSettings.activeObj.type === 'polygon') &&
                    allSettings.activeObj.specialType !== 'cropbox' && (
                        <NavLeftColor
                            canvas={allSettings.canvas}
                            activeObj={allSettings.activeObj}
                            trackOutSideClick={props.trackOutSideClick}
                        />
                    )}
                {(allSettings.activeObj.type === 'image' || croppingObj !== {}) &&
                    allSettings.activeObj.specialType !== 'background' && (
                        <NavLeftImg
                            currentSidebar={props.currentSidebar}
                            setCurrentSidebar={props.setCurrentSidebar}
                            trackOutSideClick={props.trackOutSideClick}
                            croppingObj={croppingObj}
                            setCroppingObj={setCroppingObj}
                            allSettings={allSettings}
                        />
                    )}
                {allSettings.activeObj.type === 'i-text' && (
                    <NavLeftText
                        setTextIsEditing={setTextIsEditing}
                        canvas={allSettings.canvas}
                        activeObj={allSettings.activeObj}
                        trackOutSideClick={props.trackOutSideClick}
                    />
                )}
                {(allSettings.activeObj.type === 'rect' ||
                    allSettings.activeObj.type === 'circle' ||
                    allSettings.activeObj.type === 'triangle') &&
                    allSettings.activeObj.specialType !== 'cropbox' && (
                        <NavLeftShape
                            trackOutSideClick={props.trackOutSideClick}
                            canvas={allSettings.canvas}
                            activeObj={allSettings.activeObj}
                        />
                    )}
            </div>
            {allSettings.activeObj.specialType !== 'cropbox' && (
                <div className='componentsNavRight'>
                    {allSettings.activeObj.type && (
                        <NavRightPartial
                            copyHandler={copyHandler}
                            cutHandler={cutHandler}
                            pasteHandler={pasteHandler}
                            delHandler={delHandler}
                            canvas={allSettings.canvas}
                            activeObj={allSettings.activeObj}
                            setActiveObj={allSettings.setActiveObj}
                            trackOutSideClick={props.trackOutSideClick}
                        />
                    )}
                    {clipboard && (
                        <div className='paste'>
                            <icons.Paste className='activeButton' onClick={pasteHandler} />
                        </div>
                    )}
                    {allSettings.hasUndo && (
                        <div className='undo'>
                            <icons.Undo
                                className='activeButton'
                                onClick={() => {
                                    allSettings.canvas.undo();
                                    allSettings.setActiveObj({});
                                }}
                            />
                        </div>
                    )}
                    {allSettings.hasRedo && (
                        <div className='redo'>
                            <icons.Redo
                                className='activeButton'
                                onClick={() => {
                                    allSettings.canvas.redo();
                                    allSettings.setActiveObj({});
                                }}
                            />
                        </div>
                    )}
                    {allSettings.activeObj.specialType !== 'background' && (
                        <div className='selectAll'>
                            <icons.SelectAll className='activeButton' onClick={selectAllHandler} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

ComponentsSelection.propTypes = {
    currentSidebar: PropTypes.string.isRequired,
    setCurrentSidebar: PropTypes.func.isRequired,
    trackOutSideClick: PropTypes.func.isRequired,
    allSettings: PropTypes.object.isRequired,
};

export default ComponentsSelection;
