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
    const [viewRatio, setViewRatio] = React.useState(0);

    // TODO: 測試用資料-圖片元件,待更新
    const imgComponentsInit = [
        {
            fileURL:
                'https://global-uploads.webflow.com/5bcb5ee81fb2091a2ec550c7/5e53787beba259a7b2422728_sprinter-colour.svg',
            top: 30,
            left: 100,
            scaleX: 0.2,
            scaleY: 0.2,
            angle: 30,
        },
        {
            fileURL:
                'https://global-uploads.webflow.com/5bcb5ee81fb2091a2ec550c7/5e5375a1258ffe500990a22c_soccer-colour-.svg',
            top: 80,
            left: 200,
            scaleX: 0.3,
            scaleY: 0.3,
            angle: 0,
        },
    ];
    const [imgComponents, setImgComponents] = React.useState(imgComponentsInit);
    // TODO: 測試用資料-文字元件,待更新
    const textComponentsInit = [{ test: 'testCom' }];
    const [textComponents, setTextComponents] = React.useState(textComponentsInit);

    // settings for canvas and elements inside
    const drawingAreaSettings = {
        canvasSetting,
        setCanvasSetting,
        imgComponents,
        setImgComponents,
        textComponents,
        setTextComponents,
        viewRatio,
        setViewRatio,
    };

    // render
    return (
        <div className='App'>
            {/* TODO: 顯示比例測試,待刪除 */}
            <Header />
            <SideBar />
            <MainBoard drawingAreaSettings={drawingAreaSettings} />
        </div>
    );
}
