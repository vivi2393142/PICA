import * as config from './globalConfig';
// crop image
// -- preset dark background, cropping target index
const createDarkBackground = (canvasSetting) => {
    return new fabric.Rect({
        height: canvasSetting.height,
        width: canvasSetting.width,
        fill: 'rgba(0, 0, 0, 0.8)',
        specialType: 'cropBackground',
    });
};

export const startCropping = (canvas, canvasSetting, activeObj) => {
    canvas.offHistory();
    // --- add dark background and enable to choose other then crop box
    const darkBackground = createDarkBackground(canvasSetting);
    darkBackground.on('mousedown', () => {
        canvas.setActiveObject(clipPathView);
    });
    canvas.add(darkBackground);
    // --- disable all controls
    canvas.getObjects().forEach((obj) => {
        obj.hasControls = false;
        obj.selectable = false;
        obj.hoverCursor = 'default';
    });
    activeObj.bringToFront();
    // --- preset clippath
    const currentObj = activeObj;
    currentObj.clipPath = null;
    // --- clone cropping target to create crop box
    const clipPathView = new fabric.Rect({
        specialType: 'cropbox',
        originX: currentObj.originX,
        originY: currentObj.originY,
        left: currentObj.left,
        top: currentObj.top,
        width: currentObj.width * currentObj.scaleX - 1,
        height: currentObj.height * currentObj.scaleY - 1,
        angle: currentObj.angle,
        fill: 'rgba(0,0,0,0)',
        borderDashArray: [5, 3],
        borderColor: config.mainColor,
        cornerColor: config.mainColor,
        cornerStrokeColor: config.mainColor,
    });
    canvas.add(clipPathView);
    clipPathView.set({ borderColor: config.mainColor });
    clipPathView.lockMovementX = true;
    clipPathView.lockMovementY = true;
    clipPathView.hoverCursor = 'default';
    clipPathView.setControlsVisibility({
        mtr: false,
    });
    canvas.setActiveObject(clipPathView);
};

export const confirmCropping = (canvas, activeObj, croppingObj, croppingObjIndex) => {
    // --- set actual clippath through crop box(since the location mode is different)
    const clipPath = new fabric.Rect({
        height: (activeObj.height * activeObj.scaleY) / croppingObj.scaleY + 4,
        width: (activeObj.width * activeObj.scaleX) / croppingObj.scaleX + 4,
        top: (-activeObj.height / 2 + activeObj.top - croppingObj.top) / croppingObj.scaleY - 2,
        left: (-activeObj.width / 2 + activeObj.left - croppingObj.left) / croppingObj.scaleX - 2,
    });
    // --- enable all controls
    canvas.getObjects().forEach((obj) => {
        obj.hasControls = true;
        obj.selectable = true;
        obj.hoverCursor = 'move';
    });

    // --- remove crop box and dark background
    canvas.remove(activeObj);
    canvas.remove(canvas.getObjects()[canvas.getObjects().length - 2]);
    // --- reset clippath and index
    croppingObj.clipPath = clipPath;
    canvas.moveTo(croppingObj, croppingObjIndex);
    // --- render
    canvas.requestRenderAll();
    canvas.onHistory();
};

export const cancelCropping = (canvas, activeObj, croppingObj, croppingObjIndex) => {
    // --- enable all controls
    canvas.getObjects().forEach((obj) => {
        obj.hasControls = true;
        obj.selectable = true;
        obj.hoverCursor = 'move';
    });
    // --- reset index
    canvas.moveTo(croppingObj, croppingObjIndex);
    // --- remove crop box and dark background
    canvas.remove(activeObj);
    canvas.remove(canvas.getObjects()[canvas.getObjects().length - 1]);
    // --- render
    canvas.requestRenderAll();
    canvas.onHistory();
};
