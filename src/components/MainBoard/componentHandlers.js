// clientSide button handlers
// -- add new components: rectangle, circle, triangle, text, image
const mainColor = '#e89a4f';
let _clipboard = false;
const addRect = (canvi) => {
    canvi.add(
        new fabric.Rect({
            height: 100,
            width: 100,
            fill: mainColor,
        })
    );
    canvi.requestRenderAll();
};

const addCircle = (canvi) => {
    canvi.add(
        new fabric.Circle({
            radius: 50,
            fill: mainColor,
            // left: 100,
            // top: 100,
        })
    );
    canvi.requestRenderAll();
};
const addTriangle = (canvi) => {
    canvi.add(
        new fabric.Triangle({
            width: 100,
            height: 100,
            fill: mainColor,
            // top: 10,
            // left: 60,
        })
    );
    canvi.requestRenderAll();
};
const addIText = (canvi) => {
    canvi.add(
        new fabric.IText('雙擊我編輯', {
            // left: 0,
            // top: 120,
        })
    );
    canvi.requestRenderAll();
};
const addImage = (canvi) => {
    fabric.Image.fromURL(
        'https://www.pakutaso.com/shared/img/thumb/AMEMAN17826009_TP_V.jpg',
        (img) => {
            const oImg = img.set({
                left: 300,
                top: 100,
                angle: 15,
                scaleX: 0.1,
                scaleY: 0.1,
            });
            canvi.add(oImg);
        }
    );
    canvi.requestRenderAll();
};

// -- add new components: add background
const backgroundColorHandler = (canvas) => {
    canvas.backgroundImage = 0;
    canvas.backgroundColor = mainColor;
    canvas.requestRenderAll();
};

const backgroundImageHandler = (canvas) => {
    fabric.Image.fromURL(
        'https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg?cs=srgb&dl=pexels-matheus-natan-3394939.jpg&fm=jpg',
        function (img) {
            canvas.setBackgroundColor(img);
            canvas.setBackgroundImage(img, canvas.requestRenderAll.bind(canvas), {
                scaleX: canvas.width / img.width,
                scaleY: canvas.height / img.height,
            });
        }
    );
};

// -- methods for component: copy, cut, paste, delete
const copyHandler = (canvas) => {
    if (canvas.getActiveObject()) {
        canvas.getActiveObject().clone(function (cloned) {
            _clipboard = cloned;
        });
    }
};
const cutHandler = (canvas) => {
    if (canvas.getActiveObject()) {
        canvas.getActiveObject().clone(function (cloned) {
            _clipboard = cloned;
            const activeObject = canvas.getActiveObjects();
            canvas.remove(...activeObject);
            canvas.discardActiveObject();
        });
    }
};
const pasteHandler = (canvas) => {
    if (_clipboard === false) {
        return;
    }
    _clipboard.clone(function (clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
        });
        if (clonedObj.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function (obj) {
                canvas.add(obj);
            });
            // this should solve the unselect ability
            clonedObj.setCoords();
        } else {
            canvas.add(clonedObj);
        }
        _clipboard.top += 10;
        _clipboard.left += 10;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
    });
};
const delHandler = (canvas) => {
    if (canvas.getActiveObject()) {
        const activeObject = canvas.getActiveObjects();
        canvas.remove(...activeObject);
        canvas.discardActiveObject();
    }
};

// -- methods for component: group, ungroup, selectAll
const groupHandler = (canvas) => {
    if (canvas.getActiveObject() && canvas.getActiveObject().type === 'activeSelection') {
        canvas.getActiveObject().toGroup();
        canvas.requestRenderAll();
    }
};
const ungroupHandler = (canvas) => {
    if (canvas.getActiveObject() && canvas.getActiveObject().type === 'group') {
        canvas.getActiveObject().toActiveSelection();
        canvas.requestRenderAll();
    }
};
const selectAllHandler = (canvas) => {
    canvas.discardActiveObject();
    var sel = new fabric.ActiveSelection(canvas.getObjects(), {
        canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
};

// -- methods for component: sendBackwards, sendToBack, bringForward, bringToFront
const downerHandler = (canvas) => {
    if (canvas.getActiveObject()) {
        canvas.getActiveObject().sendBackwards();
    }
};
const upperHandler = (canvas) => {
    if (canvas.getActiveObject()) {
        canvas.getActiveObject().bringForward();
    }
};
const toTopHandler = (canvas) => {
    if (canvas.getActiveObject()) {
        canvas.getActiveObject().bringToFront();
    }
};
const toBottomHandler = (canvas) => {
    if (canvas.getActiveObject()) {
        canvas.getActiveObject().sendToBack();
    }
};

// -- methods for component: align components
const alignHandler = (canvas, side) => {
    const activeObj = canvas.getActiveObject();
    const groupWidth = activeObj.getBoundingRect().width;
    const groupHeight = activeObj.getBoundingRect().height;

    switch (side) {
        case 'left':
            if (canvas.getActiveObject().type === 'activeSelection') {
                canvas.getActiveObjects().forEach((obj) => {
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
            if (canvas.getActiveObject().type === 'activeSelection') {
                canvas.getActiveObjects().forEach((obj) => {
                    const itemWidth = obj.getBoundingRect().width;
                    obj.set({
                        left: groupWidth / 2 - itemWidth / 2,
                        originX: 'center',
                    });
                });
            } else {
                activeObj.set({
                    left: canvas.width - activeObj.width * activeObj.scaleX,
                    originX: 'left',
                });
            }
            break;
        case 'top':
            if (canvas.getActiveObject().type === 'activeSelection') {
                canvas.getActiveObjects().forEach((obj) => {
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
            if (canvas.getActiveObject().type === 'activeSelection') {
                canvas.getActiveObjects().forEach((obj) => {
                    const itemHeight = obj.getBoundingRect().height;
                    obj.set({
                        top: groupHeight / 2 - itemHeight / 2,
                        originY: 'center',
                    });
                });
            } else {
                activeObj.set({
                    top: canvas.height - activeObj.height * activeObj.scaleY,
                    originY: 'top',
                });
            }
            break;
        case 'horizonCenter':
            if (canvas.getActiveObject().type === 'activeSelection') {
                canvas.getActiveObjects().forEach((obj) => {
                    obj.set({
                        left: 0,
                        originX: 'center',
                    });
                });
            } else {
                activeObj.set({
                    left: canvas.width / 2,
                    originX: 'center',
                });
            }
            break;
        case 'verticalCenter':
            if (canvas.getActiveObject().type === 'activeSelection') {
                canvas.getActiveObjects().forEach((obj) => {
                    obj.set({
                        top: 0,
                        originY: 'center',
                    });
                });
            } else {
                activeObj.set({
                    top: canvas.height / 2,
                    originY: 'center',
                });
            }
            break;
    }
    canvas.requestRenderAll();
    // trigger 'object:modified' event
    canvas.fire('object:modified', { target: activeObj });
};

// -- methods for component: onkeydown setting
const keyDownHandlers = (canvas) => {
    let ctrlDown = false;
    const codes = {
        ctrlKey: 17,
        cmdKey: 91,
        delKey: 8,
        vKey: 86,
        xKey: 88,
        cKey: 67,
        aKey: 65,
    };

    // add new key function
    document.addEventListener(
        'keydown',
        (e) => {
            // console.log(e.keyCode);
            if (e.keyCode == codes.ctrlKey || e.keyCode == codes.cmdKey) {
                ctrlDown = true;
            }
            if (ctrlDown && e.keyCode == codes.cKey) {
                copyHandler(canvas);
            }
            if (ctrlDown && e.keyCode == codes.xKey) {
                cutHandler(canvas);
            }
            if (ctrlDown && e.keyCode == codes.vKey) {
                pasteHandler(canvas);
            }
            if (e.keyCode == codes.delKey) {
                delHandler(canvas);
            }
            if (ctrlDown && e.keyCode == codes.aKey) {
                e.preventDefault();
                selectAllHandler(canvas);
            }
        },
        false
    );

    document.addEventListener(
        'keyup',
        (e) => {
            if (e.keyCode == codes.ctrlKey || e.keyCode == codes.cmdKey) {
                ctrlDown = false;
            }
        },
        false
    );
};

// TODO: 測試用資料，待刪除
const logCurrentCanvas = (canvas) => {
    var json = canvas.toJSON();
    console.log(JSON.stringify(json));
};

export {
    addRect,
    addCircle,
    addTriangle,
    addIText,
    addImage,
    copyHandler,
    cutHandler,
    pasteHandler,
    delHandler,
    groupHandler,
    ungroupHandler,
    selectAllHandler,
    keyDownHandlers,
    downerHandler,
    upperHandler,
    toTopHandler,
    toBottomHandler,
    logCurrentCanvas,
    alignHandler,
    backgroundColorHandler,
    backgroundImageHandler,
};
