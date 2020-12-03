import React from 'react';
import Canvas from './components/Canvas/index';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app';
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';

// export default App;
export default function App() {
    const firebaseConfig = {
        apiKey: 'AIzaSyDtNmp8oroSpowKQmr4nHAgqsJ59VCafYE',
        authDomain: 'pica-b4a59.firebaseapp.com',
        databaseURL: 'https://pica-b4a59.firebaseio.com',
        projectId: 'pica-b4a59',
        storageBucket: 'pica-b4a59.appspot.com',
        messagingSenderId: '897821043480',
        appId: '1:897821043480:web:cf4c3d4eba424800d7cc6d',
        measurementId: 'G-R544SCV03H',
    };
    // firebase.initializeApp(firebaseConfig);

    // render
    return (
        <div className='App'>
            <Canvas />
        </div>
    );
}
