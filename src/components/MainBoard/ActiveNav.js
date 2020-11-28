import React from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import 'fabric-history';
import * as icons from '../../icons.js';

const ActiveNav = (props) => {
    const mainColor = '#e89a4f';
    let _clipboard = false;
    // -- add new components: rectangle, circle, triangle, text, image
    const addRect = () => {
        const rect = new fabric.Rect({
            height: 100,
            width: 100,
            fill: mainColor,
        });
        props.canvas.add(rect);
    };
    const addCircle = () => {
        const circle = new fabric.Circle({
            radius: 50,
            fill: mainColor,
        });
        props.canvas.add(circle);
        props.canvas.requestRenderAll();
    };
    const addTriangle = () => {
        const triangle = new fabric.Triangle({
            width: 100,
            height: 100,
            fill: mainColor,
        });
        props.canvas.add(triangle);
        props.canvas.requestRenderAll();
    };
    const addIText = () => {
        let text = new fabric.IText('雙擊我編輯', {});
        props.canvas.add(text);
        text.setControlsVisibility({
            mb: false,
            mt: false,
            ml: false,
            mr: false,
        });

        props.canvas.requestRenderAll();
    };
    const addImage = () => {
        fabric.Image.fromURL(
            'https://www.pakutaso.com/shared/img/thumb/AMEMAN17826009_TP_V.jpg',
            (img) => {
                const oImg = img.set({
                    scaleX: 0.1,
                    scaleY: 0.1,
                });
                props.canvas.add(oImg);
                oImg.setControlsVisibility({
                    mb: false,
                    mt: false,
                    ml: false,
                    mr: false,
                });
            }
        );
        props.canvas.requestRenderAll();
    };

    // -- add new components: add background
    const backgroundColorHandler = () => {
        props.canvas.backgroundImage = 0;
        props.canvas.backgroundColor = mainColor;
        props.canvas.requestRenderAll();
        // trigger 'object:modified' event
        props.canvas.fire('object:modified');
    };
    const backgroundImageHandler = () => {
        fabric.Image.fromURL(
            'https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg?cs=srgb&dl=pexels-matheus-natan-3394939.jpg&fm=jpg',
            function (img) {
                props.canvas.setBackgroundColor(img);
                props.canvas.setBackgroundImage(
                    img,
                    props.canvas.requestRenderAll.bind(props.canvas),
                    {
                        scaleX: props.canvas.width / img.width,
                        scaleY: props.canvas.height / img.height,
                    }
                );
            }
        );
        // trigger 'object:modified' event
        props.canvas.fire('object:modified');
    };

    // -- methods for component: copy, cut, paste, delete
    const copyHandler = () => {
        if (props.canvas.getActiveObject()) {
            props.canvas.getActiveObject().clone(function (cloned) {
                _clipboard = cloned;
            });
        }
    };
    const cutHandler = () => {
        if (props.canvas.getActiveObject()) {
            props.canvas.getActiveObject().clone(function (cloned) {
                _clipboard = cloned;
                const activeObject = props.canvas.getActiveObjects();
                props.canvas.remove(...activeObject);
                props.canvas.discardActiveObject();
            });
        }
    };
    const pasteHandler = () => {
        if (_clipboard === false) {
            return;
        }
        _clipboard.clone(function (clonedObj) {
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
            _clipboard.top += 10;
            _clipboard.left += 10;
            props.canvas.setActiveObject(clonedObj);
            props.canvas.requestRenderAll();
        });
    };
    const delHandler = () => {
        if (props.canvas.getActiveObject()) {
            const activeObject = props.canvas.getActiveObjects();
            props.canvas.remove(...activeObject);
            props.canvas.discardActiveObject();
        }
    };

    // -- methods for component: group, ungroup, selectAll
    const groupHandler = () => {
        if (
            props.canvas.getActiveObject() &&
            props.canvas.getActiveObject().type === 'activeSelection'
        ) {
            props.canvas.getActiveObject().toGroup();
            props.canvas.requestRenderAll();
        }
    };
    const ungroupHandler = () => {
        if (props.canvas.getActiveObject() && props.canvas.getActiveObject().type === 'group') {
            props.canvas.getActiveObject().toActiveSelection();
            props.canvas.requestRenderAll();
        }
    };
    const selectAllHandler = () => {
        props.canvas.discardActiveObject();
        var sel = new fabric.ActiveSelection(props.canvas.getObjects(), {
            canvas: props.canvas,
        });
        props.canvas.setActiveObject(sel);
        props.canvas.requestRenderAll();
    };

    // -- methods for component: sendBackwards, sendToBack, bringForward, bringToFront
    const downerHandler = () => {
        if (props.canvas.getActiveObject()) {
            props.canvas.getActiveObject().sendBackwards();
        }
    };
    const upperHandler = () => {
        if (props.canvas.getActiveObject()) {
            props.canvas.getActiveObject().bringForward();
        }
    };
    const toTopHandler = () => {
        if (props.canvas.getActiveObject()) {
            props.canvas.getActiveObject().bringToFront();
        }
    };
    const toBottomHandler = () => {
        if (props.canvas.getActiveObject()) {
            props.canvas.getActiveObject().sendToBack();
        }
    };

    // -- methods for component: align components
    const alignHandler = (side) => {
        const activeObj = props.canvas.getActiveObject();
        if (activeObj) {
            const groupWidth = activeObj.getBoundingRect().width;
            const groupHeight = activeObj.getBoundingRect().height;

            switch (side) {
                case 'left':
                    if (props.canvas.getActiveObject().type === 'activeSelection') {
                        props.canvas.getActiveObjects().forEach((obj) => {
                            obj.set({
                                left: -(groupWidth / 2),
                                originX: 'left',
                            });
                        });
                    } else {
                        activeObj.set({
                            left: 0,
                            originX: 'left',
                        });
                    }
                    break;
                case 'right':
                    if (props.canvas.getActiveObject().type === 'activeSelection') {
                        props.canvas.getActiveObjects().forEach((obj) => {
                            const itemWidth = obj.getBoundingRect().width;
                            obj.set({
                                left: groupWidth / 2 - itemWidth / 2,
                                originX: 'center',
                            });
                        });
                    } else {
                        activeObj.set({
                            left: props.canvas.width - activeObj.width * activeObj.scaleX,
                            originX: 'left',
                        });
                    }
                    break;
                case 'top':
                    if (props.canvas.getActiveObject().type === 'activeSelection') {
                        props.canvas.getActiveObjects().forEach((obj) => {
                            obj.set({
                                top: -(groupHeight / 2),
                                originY: 'top',
                            });
                        });
                    } else {
                        activeObj.set({
                            top: 0,
                            originY: 'top',
                        });
                    }
                    break;
                case 'bottom':
                    if (props.canvas.getActiveObject().type === 'activeSelection') {
                        props.canvas.getActiveObjects().forEach((obj) => {
                            const itemHeight = obj.getBoundingRect().height;
                            obj.set({
                                top: groupHeight / 2 - itemHeight / 2,
                                originY: 'center',
                            });
                        });
                    } else {
                        activeObj.set({
                            top: props.canvas.height - activeObj.height * activeObj.scaleY,
                            originY: 'top',
                        });
                    }
                    break;
                case 'horizonCenter':
                    if (props.canvas.getActiveObject().type === 'activeSelection') {
                        props.canvas.getActiveObjects().forEach((obj) => {
                            obj.set({
                                left: 0,
                                originX: 'center',
                            });
                        });
                    } else {
                        activeObj.set({
                            left: props.canvas.width / 2,
                            originX: 'center',
                        });
                    }
                    break;
                case 'verticalCenter':
                    if (props.canvas.getActiveObject().type === 'activeSelection') {
                        props.canvas.getActiveObjects().forEach((obj) => {
                            obj.set({
                                top: 0,
                                originY: 'center',
                            });
                        });
                    } else {
                        activeObj.set({
                            top: props.canvas.height / 2,
                            originY: 'center',
                        });
                    }
                    break;
            }
            props.canvas.requestRenderAll();
            // trigger 'object:modified' event
            props.canvas.fire('object:modified', { target: activeObj });
        }
    };

    // -- methods for component: onkeydown setting
    React.useEffect(() => {
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
            // console.log(e.keyCode);
            if (e.keyCode == codes.ctrlKey || e.keyCode == codes.cmdKey) {
                ctrlDown = true;
            }
            if (e.keyCode == codes.shiftKey) {
                shiftDown = true;
            }
            if (ctrlDown && e.keyCode == codes.cKey) {
                copyHandler();
            }
            if (ctrlDown && e.keyCode == codes.xKey) {
                cutHandler();
            }
            if (ctrlDown && e.keyCode == codes.vKey) {
                pasteHandler();
            }
            if (e.keyCode == codes.delKey) {
                delHandler();
            }
            if (ctrlDown && e.keyCode == codes.aKey) {
                e.preventDefault();
                selectAllHandler();
            }
            if (ctrlDown && e.keyCode == codes.zKey && !shiftDown) {
                props.canvas.undo();
            }
            if (ctrlDown && shiftDown && e.keyCode == codes.zKey) {
                props.canvas.redo();
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
    }, [props.canvas]);

    // TODO: 測試用資料，待刪除
    const logCurrentCanvas = () => {
        var json = props.canvas.toJSON();
        console.log(JSON.stringify(json));
    };

    return (
        <div>
            <div className='testNav'>
                新增物件
                <button onClick={addRect}>新增方形</button>
                <button onClick={addCircle}>新增圓形</button>
                <button onClick={addTriangle}>新增三角形</button>
                <button onClick={addIText}>新增文字</button>
                <button onClick={addImage}>新增圖片</button>
                <button onClick={backgroundColorHandler}>加入背景色彩</button>
                <button onClick={backgroundImageHandler}>加入背景圖片</button>
                <br />
                物件共用選項
                <button onClick={copyHandler}>複製</button>
                <button onClick={cutHandler}>剪下</button>
                <button onClick={pasteHandler}>貼上</button>
                <button onClick={delHandler}>刪除</button>
                <button onClick={groupHandler}>群組</button>
                <button onClick={ungroupHandler}>取消群組</button>
                <button onClick={selectAllHandler}>全選</button>
                <button onClick={upperHandler}>上移一層</button>
                <button onClick={toTopHandler}>移到頂層</button>
                <button onClick={downerHandler}>下移一層</button>
                <button onClick={toBottomHandler}>移到底層</button>
                <button onClick={() => alignHandler('horizonCenter')}>水平置中</button>
                <button onClick={() => alignHandler('verticalCenter')}>垂直置中</button>
                <button onClick={() => alignHandler('left')}>靠左對齊</button>
                <button onClick={() => alignHandler('right')}>靠右對齊</button>
                <button onClick={() => alignHandler('top')}>靠上對齊</button>
                <button onClick={() => alignHandler('bottom')}>靠下對齊</button>
                <button onClick={logCurrentCanvas}>印出canvas</button>
                <br />
                復原重做
                <button
                    className={props.hasUndo ? 'undoRedo' : 'nonUndoRedo'}
                    onClick={() => props.canvas.undo()}
                >
                    復原
                </button>
                <button
                    className={props.hasRedo ? 'undoRedo' : 'nonUndoRedo'}
                    onClick={() => props.canvas.redo()}
                >
                    重做
                </button>
            </div>

            {props.activeObjType === 'image' ? (
                <div className='testNavForImage'>
                    圖片用選項
                    <button>剪裁圖片</button>
                    <button>剪裁取消</button>
                    <button>剪裁完成</button>
                </div>
            ) : props.activeObjType === 'i-text' ? (
                <div className='testNavForText'>文字用選項</div>
            ) : null}

            {/* 
            <div className='componentsNavLeft'></div>
            <div className='componentsNavRight'>
                <icons.Undo />
                <icons.Redo />
                <icons.ToBottom />
                <icons.ToTop />
                <icons.Upper />
                <icons.Downer />
                <icons.Layer />
                <icons.Align />
                <icons.Copy />
                <icons.TrashCan />
            </div> */}
        </div>
    );
};

ActiveNav.propTypes = {
    canvas: PropTypes.object.isRequired,
    setCanvas: PropTypes.func.isRequired,
    setActiveObjType: PropTypes.func.isRequired,
    activeObjType: PropTypes.string.isRequired,
    hasUndo: PropTypes.bool.isRequired,
    hasRedo: PropTypes.bool.isRequired,
};

export default ActiveNav;
