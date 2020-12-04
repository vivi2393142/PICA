import React from 'react';
import Canvas from './components/Canvas/index';
import LandingPage from './components/LandingPage/index';
import MainPage from './components/MainPage/index';
import * as firebase from './firebase';

// export default App;
export default function App() {
    const [isUserLogin, setIsUserLogin] = React.useState(null);

    // render
    return (
        <div className='App'>
            {/* <Canvas /> */}
            {isUserLogin ? (
                <MainPage setIsUserLogin={setIsUserLogin} />
            ) : (
                <LandingPage setIsUserLogin={setIsUserLogin} />
            )}
        </div>
    );
}
