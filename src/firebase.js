import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
// Import firebaseui module.
import * as firebaseui from 'firebaseui';

// init firebase
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// firestore
const updateCanvasData = (canvas, canvasSetting) => {
    const canvasData = JSON.stringify(canvas.toJSON());
    const ref = db.collection('canvasFiles').doc(canvasSetting.id);
    ref.set({
        data: canvasData,
        basicSetting: canvasSetting,
    }).then(() => {
        console.log('set data successful');
    });
};

const getCanvasData = (canvasSetting) => {
    const ref = db.collection('canvasFiles').doc('K_Qoc5zNxFueM587vn2oD');
    ref.get().then((doc) => {
        console.log(doc.data());
    });
};

// native login
const checkCurrentUser = (successCallback, failCallback) => {
    successCallback;
    const user = firebase.auth().currentUser;
    // console.log(user);
    // console.log('已執行');
    if (user) {
        successCallback();
        return user;
    } else {
        failCallback();
    }
};

const nativeSignUp = (email, pwd, successCallback) => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, pwd)
        .then((user) => {
            successCallback();
            // console.log(user);
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // console.log(errorCode, errorMessage);
            alert('請輸入有效之email地址及6位以上密碼');
        });
};

const nativeSignIn = (email, pwd, successCallback) => {
    firebase
        .auth()
        .signInWithEmailAndPassword(email, pwd)
        .then((user) => {
            successCallback();
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert('請輸入正確帳號密碼');
        });
};

const nativeSignOut = (successCallback) => {
    firebase
        .auth()
        .signOut()
        .then(
            function () {
                successCallback();
                // console.log('User sign out!');
            },
            function (error) {
                // console.log('User sign out error!');
            }
        );
};

export {
    db,
    updateCanvasData,
    getCanvasData,
    nativeSignUp,
    nativeSignIn,
    nativeSignOut,
    checkCurrentUser,
};
