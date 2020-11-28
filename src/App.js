import React from 'react';
import './App.scss';
import MainBoard from './components/MainBoard';
import Header from './components/Header';
import SideBar from './components/SideBar';

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
                type: 'image',
                version: '4.2.0',
                originX: 'left',
                originY: 'top',
                left: 117.78,
                top: 63.76,
                width: 514,
                height: 619,
                fill: 'rgb(0,0,0)',
                stroke: null,
                strokeWidth: 0,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeMiterLimit: 4,
                scaleX: 0.3,
                scaleY: 0.3,
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
                src:
                    'https://global-uploads.webflow.com/5bcb5ee81fb2091a2ec550c7/5e5375a1258ffe500990a22c_soccer-colour-.svg',
                crossOrigin: null,
                filters: [],
            },
            {
                type: 'image',
                version: '4.2.0',
                originX: 'left',
                originY: 'top',
                left: 351.15,
                top: 55.69,
                width: 628,
                height: 724,
                fill: 'rgb(0,0,0)',
                stroke: null,
                strokeWidth: 0,
                strokeDashArray: null,
                strokeLineCap: 'butt',
                strokeDashOffset: 0,
                strokeLineJoin: 'miter',
                strokeMiterLimit: 4,
                scaleX: 0.23,
                scaleY: 0.23,
                angle: 4.81,
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
                src:
                    'https://global-uploads.webflow.com/5bcb5ee81fb2091a2ec550c7/5e53787beba259a7b2422728_sprinter-colour.svg',
                crossOrigin: null,
                filters: [],
            },
            {
                type: 'i-text',
                version: '4.2.0',
                originX: 'left',
                originY: 'top',
                left: 0,
                top: 0,
                width: 200,
                height: 45.2,
                fill: 'rgb(0,0,0)',
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
                text: '雙擊我編輯',
                fontSize: 40,
                fontWeight: 'normal',
                fontFamily: 'Times New Roman',
                fontStyle: 'normal',
                lineHeight: 1.16,
                underline: false,
                overline: false,
                linethrough: false,
                textAlign: 'left',
                textBackgroundColor: '',
                charSpacing: 0,
                styles: {},
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
    };

    // render
    return (
        <div className='App'>
            <Header />
            <SideBar />
            <MainBoard drawingAreaSettings={drawingAreaSettings} />
        </div>
    );
}
