import React from 'react';
import './App.scss';
import MainBoard from './components/MainBoard';
import Header from './components/Header';

// export default App;
export default function App() {
    // TODO: 測試用資料-畫布設定,待更新
    const canvasSettingInit = { width: 600, height: 400 };
    const [canvasSetting, setCanvasSetting] = React.useState(canvasSettingInit);
    // TODO: 測試用資料-canvas原生資料
    let canvasDataInit = {
        version: '4.2.0',
        objects: [
            {
                type: 'i-text',
                version: '4.2.0',
                originX: 'left',
                originY: 'top',
                left: 36.04,
                top: 223.05,
                width: 179.1,
                height: 146.45,
                fill: 'rgba(14, 87, 88, 0.95)',
                stroke: null,
                strokeWidth: 1,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeMiterLimit: 4,
                scaleX: 0.71,
                scaleY: 0.71,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: null,
                visible: true,
                backgroundColor: '',
                fillRule: 'nonzero',
                paintFirst: 'fill',
                globalCompositeOperation: 'source-over',
                skewX: 0,
                skewY: 0,
                text: '哈囉1\n你好\ntttttttttttt',
                fontSize: 36,
                fontWeight: 'normal',
                fontFamily: 'Sans-serif',
                fontStyle: 'italic',
                lineHeight: '1.3',
                underline: false,
                overline: false,
                linethrough: false,
                textAlign: 'right',
                textBackgroundColor: '',
                charSpacing: '65',
                styles: {},
            },
            {
                type: 'rect',
                version: '4.2.0',
                originX: 'left',
                originY: 'top',
                left: 399.41,
                top: 29.23,
                width: 100,
                height: 100,
                fill: 'rgba(129, 87, 52, 0.47)',
                stroke: null,
                strokeWidth: 1,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeMiterLimit: 4,
                scaleX: 1,
                scaleY: 1,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: null,
                visible: true,
                backgroundColor: '',
                fillRule: 'nonzero',
                paintFirst: 'fill',
                globalCompositeOperation: 'source-over',
                skewX: 0,
                skewY: 0,
                rx: 0,
                ry: 0,
            },
            {
                type: 'image',
                version: '4.2.0',
                originX: 'left',
                originY: 'top',
                left: 207.69,
                top: 29.23,
                width: 275,
                height: 297,
                fill: 'rgb(0,0,0)',
                stroke: null,
                strokeWidth: 0,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeMiterLimit: 4,
                scaleX: 0.62,
                scaleY: 0.54,
                angle: 0,
                flipX: false,
                flipY: false,
                opacity: 1,
                shadow: null,
                visible: true,
                backgroundColor: '',
                fillRule: 'nonzero',
                paintFirst: 'fill',
                globalCompositeOperation: 'source-over',
                skewX: 0,
                skewY: 0,
                cropX: 0,
                cropY: 0,
                src: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg',
                crossOrigin: 'anonymous',
                filters: [],
            },
        ],
        background: '#fff',
    };

    const [canvasData, setCanvasData] = React.useState(canvasDataInit);
    // settings for canvas and elements inside
    const drawingAreaSettings = {
        canvasSetting,
        setCanvasSetting,
        canvasData,
        setCanvasData,
        canvasSettingInit,
        setCanvasSetting,
    };

    // render
    return (
        <div className='App'>
            <Header />
            <MainBoard drawingAreaSettings={drawingAreaSettings} />
        </div>
    );
}
