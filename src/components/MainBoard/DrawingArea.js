import React from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import * as icons from '../../icons.js';
import * as handlers from './componentHandlers';

const DrawingArea = (props) => {
    const allSettings = props.drawingAreaSettings;
    const [canvas, setCanvas] = React.useState('');
    const mainColor = '#e89a4f';

    // init fabric canvas
    React.useEffect(() => {
        // canvas setting
        const canvasInit = new fabric.Canvas('fabric-canvas', {
            height: allSettings.canvasSetting.height,
            width: allSettings.canvasSetting.width,
            backgroundColor: '#fff',
        });
        // -- load canvas init data
        canvasInit.loadFromJSON(allSettings.canvasData, function () {
            canvasInit.renderAll();
        });
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
            cornerSize: 6,
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
        // -- preset keydown combination
        handlers.keyDownHandlers(canvasInit);
        // -- set canvas
        setCanvas(canvasInit);
        // -- listen to modified event
        canvasInit.on('object:modified', (e) => {
            console.log('編輯完畢');
        });
        // TODO:處理複製剪下貼上會更新兩次的問題
        canvasInit.on('object:added', (e) => {
            console.log('新增完畢');
        });
        canvasInit.on('object:removed', (e) => {
            console.log('移除完畢');
        });

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
            <div className='testNav'>
                <button onClick={() => handlers.addRect(canvas)}>新增方形</button>
                <button onClick={() => handlers.addCircle(canvas)}>新增圓形</button>
                <button onClick={() => handlers.addTriangle(canvas)}>新增三角形</button>
                <button onClick={() => handlers.addIText(canvas)}>新增文字</button>
                <button onClick={() => handlers.addImage(canvas)}>新增圖片</button>
                <button onClick={() => handlers.copyHandler(canvas)}>複製</button>
                <button onClick={() => handlers.cutHandler(canvas)}>剪下</button>
                <button onClick={() => handlers.pasteHandler(canvas)}>貼上</button>
                <button onClick={() => handlers.delHandler(canvas)}>刪除</button>
                <button onClick={() => handlers.groupHandler(canvas)}>群組</button>
                <button onClick={() => handlers.ungroupHandler(canvas)}>取消群組</button>
                <button onClick={() => handlers.selectAllHandler(canvas)}>全選</button>
                <button onClick={() => handlers.upperHandler(canvas)}>上移一層</button>
                <button onClick={() => handlers.toTopHandler(canvas)}>移到頂層</button>
                <button onClick={() => handlers.downerHandler(canvas)}>下移一層</button>
                <button onClick={() => handlers.toBottomHandler(canvas)}>移到底層</button>
                <button>選擇顏色</button>
                <button onClick={() => handlers.alignHandler(canvas, 'horizonCenter')}>
                    水平置中
                </button>
                <button onClick={() => handlers.alignHandler(canvas, 'verticalCenter')}>
                    垂直置中
                </button>
                <button onClick={() => handlers.alignHandler(canvas, 'left')}>靠左對齊</button>
                <button onClick={() => handlers.alignHandler(canvas, 'right')}>靠右對齊</button>
                <button onClick={() => handlers.alignHandler(canvas, 'top')}>靠上對齊</button>
                <button onClick={() => handlers.alignHandler(canvas, 'bottom')}>靠下對齊</button>
                <button>重做</button>
                <button>復原</button>
                <button onClick={() => handlers.logCurrentCanvas(canvas)}>印出canvas</button>
            </div>
            {/* <div className='componentsNavLeft'>
                <icons.Undo />
                <icons.Redo />
            </div>
            <div className='componentsNavRight'>
                <icons.ToBottom />
                <icons.ToTop />
                <icons.Upper />
                <icons.Downer />
                <icons.Layer />
                <icons.Align />
                <icons.Copy />
                <icons.TrashCan />
            </div> */}
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
