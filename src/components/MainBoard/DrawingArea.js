import React from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import 'fabric-history';
import ActiveNav from './ActiveNav';
import initAligningGuidelines from './aligning_guidelines.js';

const DrawingArea = (props) => {
    const allSettings = props.drawingAreaSettings;
    const [canvas, setCanvas] = React.useState({});
    const [activeObjType, setActiveObjType] = React.useState('');
    const [hasUndo, setHasUndo] = React.useState(false);
    const [hasRedo, setHasRedo] = React.useState(false);
    // console.log(canvas.historyUndo);
    // init fabric canvas
    React.useEffect(() => {
        // canvas setting
        const canvasInit = new fabric.Canvas('fabric-canvas', {
            height: allSettings.canvasSetting.height,
            width: allSettings.canvasSetting.width,
        });

        async function presetObjectStyle() {
            // -- render initial data then clear init history
            await canvasInit.renderAll();
            canvasInit.clearHistory();
            // -- preset image, iText objects style
            let imgObjects = canvasInit.getObjects('image');
            let texObjects = canvasInit.getObjects('i-text');
            imgObjects.forEach((object) => {
                object.setControlsVisibility({
                    mb: false,
                    mt: false,
                    ml: false,
                    mr: false,
                });
            });
            texObjects.forEach((object) => {
                object.setControlsVisibility({
                    mb: false,
                    mt: false,
                    ml: false,
                    mr: false,
                });
            });
            // -- listen to all changes -> update database
            canvasInit.on('object:modified', (e) => {
                setHasUndo(canvasInit.historyUndo.length > 0);
                setHasRedo(canvasInit.historyRedo.length > 0);
                console.log('編輯完畢');
            });
            // TODO:處理複製剪下貼上會更新兩次的問題
            canvasInit.on('object:added', (e) => {
                setHasUndo(canvasInit.historyUndo.length > 0);
                setHasRedo(canvasInit.historyRedo.length > 0);
                console.log('新增完畢');
            });
            canvasInit.on('object:removed', (e) => {
                setHasUndo(canvasInit.historyUndo.length > 0);
                setHasRedo(canvasInit.historyRedo.length > 0);
                console.log('移除完畢');
            });
            // -- check active object
            canvasInit.on('mouse:down', (e) => {
                e.target ? setActiveObjType(e.target.type) : setActiveObjType('');
            });
        }
        canvasInit.loadFromJSON(allSettings.canvasData, presetObjectStyle);
        // -- init align guide lines extensions
        initAligningGuidelines(canvasInit);
        // -- customize selection style
        canvasInit.selectionColor = 'rgba(0,0,0,0.03)';
        canvasInit.selectionBorderColor = 'rgba(0,0,0,0.25)';
        canvasInit.selectionLineWidth = 1;
        // -- set layers in canvas
        canvasInit.preserveObjectStacking = true;
        // -- customize border style
        const customBorder = {
            borderColor: 'rgba(0,0,0,0.25)',
            cornerColor: 'rgba(0,0,0,0.25)',
            cornerStrokeColor: 'rgba(0,0,0,0.25)',
            cornerSize: 8,
            cornerStyle: 'circle',
            cornerColor: 'white',
        };
        fabric.Object.prototype.set(customBorder);
        // -- preset responsive canvas size
        const container = document.querySelector('.canvas-container');
        const boardToWindow = 0.9;
        container.parentNode.parentNode.style.width = `${boardToWindow * 100}%`;
        container.parentNode.parentNode.style.height = `${boardToWindow * 100}%`;
        document.querySelector('.lower-canvas').style.width = '100%';
        document.querySelector('.lower-canvas').style.height = '100%';
        document.querySelector('.upper-canvas').style.width = '100%';
        document.querySelector('.upper-canvas').style.height = '100%';
        // -- default view ratio: auto
        props.handleResponsiveSize(container);
        // -- set canvas
        setCanvas(canvasInit);
        return () => {
            canvasInit.dispose();
        };
    }, []);

    // -- handle auto resizing option
    React.useEffect(() => {
        const handleResize = () => {
            const container = document.querySelector('.canvas-container');
            if (props.ratioSelectValue === 'auto') {
                props.handleResponsiveSize(container);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [props.ratioSelectValue]);

    //render
    return (
        <div className='canvasWrapper'>
            <ActiveNav
                canvas={canvas}
                setCanvas={setCanvas}
                setActiveObjType={setActiveObjType}
                activeObjType={activeObjType}
                hasUndo={hasUndo}
                hasRedo={hasRedo}
            />
            <canvas className='drawingArea' id='fabric-canvas' />
        </div>
    );
};

DrawingArea.propTypes = {
    // TODO: 待資料確定後，明確定義 array 內容
    drawingAreaSettings: PropTypes.object.isRequired,
    ratioSelectValue: PropTypes.string.isRequired,
    handleResponsiveSize: PropTypes.func.isRequired,
};

export default DrawingArea;
