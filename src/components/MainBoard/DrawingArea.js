import React from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';

const DrawingArea = (props) => {
    const allSettings = props.drawingAreaSettings;

    React.useEffect(() => {
        // canvas setting
        const canvas = new fabric.Canvas('fabric-canvas');
        canvas.setBackgroundColor('#fff', canvas.renderAll.bind(canvas));

        // customize selection style
        canvas.selectionColor = 'rgba(0,0,0,0.03)';
        canvas.selectionBorderColor = 'rgba(0,0,0,0.2)';
        canvas.selectionLineWidth = 1;
        // customize border style
        const customBorder = {
            borderColor: 'rgba(0,0,0,0.25)',
            cornerColor: 'rgba(0,0,0,0.25)',
            cornerStrokeColor: 'rgba(0,0,0,0.25)',
            cornerSize: 6,
            cornerStyle: 'circle',
            cornerColor: 'white',
        };
        fabric.Object.prototype.set(customBorder);
        // preset responsive canvas size
        const container = document.querySelector('.canvas-container');
        const boardToWindow = 0.9;
        container.parentNode.style.width = `${boardToWindow * 100}%`;
        container.parentNode.style.height = `${boardToWindow * 100}%`;
        document.querySelector('.lower-canvas').style.width = '100%';
        document.querySelector('.lower-canvas').style.height = '100%';
        document.querySelector('.upper-canvas').style.width = '100%';
        document.querySelector('.upper-canvas').style.height = '100%';

        // window.addEventListener('resize', () => {
        //     console.log('start', props.ratioSelectValue);
        //     //TODO: 未解決讀取props.ratioSelectValue不同步的問題
        //     if (props.ratioSelectValue === 'auto') {
        //         props.handleResponsiveSize(container);
        //     }
        // });

        props.handleResponsiveSize(container);

        // -- 1. 圖片元件
        allSettings.imgComponents.forEach((imgItem) => {
            fabric.Image.fromURL(imgItem.fileURL, (img) => {
                const oImg = img.set({
                    left: imgItem.left,
                    top: imgItem.top,
                    scaleX: imgItem.scaleX,
                    scaleY: imgItem.scaleY,
                    angle: imgItem.angle,
                });
                // oImg.set(customBorder);
                canvas.add(oImg);
            });
        });

        // // -- 2. 文字元件
        // const textBox = new fabric.Textbox('Click on the Rectangle to move it.', {
        //     fontSize: 20,
        //     left: 50,
        //     top: 100,
        //     width: 200,
        // });

        // canvas.add(textBox);

        return () => {
            canvas.dispose();
        };
    }, []);

    React.useEffect(() => {
        // 移除再新增，確保state有被更新
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
        <canvas
            className='drawingArea'
            id='fabric-canvas'
            width={allSettings.canvasSetting.width}
            height={allSettings.canvasSetting.height}
        />
    );
};

DrawingArea.propTypes = {
    // TODO: 待資料確定後，明確定義 array 內容
    drawingAreaSettings: PropTypes.object.isRequired,
    ratioSelectValue: PropTypes.string.isRequired,
    handleResponsiveSize: PropTypes.func.isRequired,
};

export default DrawingArea;
