import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

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
const loadUserData = (userId, callback) => {
    const ref = firebase.firestore().collection('userData').doc(userId);
    ref.get().then((doc) => {
        const dataFromFirebase = doc.data();
        callback(dataFromFirebase);
    });
};

const createNewCanvas = (canvasSetting, userId) => {
    // add data to canvasFiles
    const ref = db.collection('canvasFiles').doc(canvasSetting.id);
    ref.set({
        data: JSON.stringify({
            version: '4.2.0',
            objects: [],
            background: '#fff',
        }),
        basicSetting: canvasSetting,
    }).then(() => {
        // add data to userData
        const userRef = db.collection('userData').doc(userId);
        userRef
            .get()
            .then((doc) => {
                let oldCanvas = doc.data().canvas;
                oldCanvas.push(canvasSetting.id);
                userRef.update({ canvas: oldCanvas }).then(() => {});
            })
            .then(() => {
                document.location.href = `../file/${canvasSetting.id}`;
            });
    });
};

const loadCanvas = (callback, fileId) => {
    const ref = firebase.firestore().collection('canvasFiles').doc(fileId);
    ref.get().then((doc) => {
        const dataFromFirebase = doc.data();
        const canvasSettingInit = dataFromFirebase.basicSetting;
        const canvasDataInit = JSON.parse(dataFromFirebase.data);
        callback(canvasSettingInit, canvasDataInit);
    });
};

let initState = true;

const listenCanvas = (fileId, callback) => {
    console.log('設定監聽事件');
    const ref = firebase.firestore().collection('canvasFiles').doc(fileId);
    ref.onSnapshot((doc) => {
        if (initState) {
            initState = false;
        } else {
            console.log('文件更新');
            callback();
        }
    });
};

const saveCanvasData = (canvas, canvasSetting) => {
    const canvasData = JSON.stringify(canvas.toJSON());
    const ref = db.collection('canvasFiles').doc(canvasSetting.id);
    ref.set({
        data: canvasData,
        basicSetting: canvasSetting,
    }).then(() => {});
};

const getCanvasData = (id, callback) => {
    const ref = db.collection('canvasFiles').doc(id);
    ref.get().then((doc) => {
        return doc.data();
    });
};

// native login
const checkCurrentUser = (successCallback, failCallback) => {
    // successCallback;
    const user = firebase.auth().currentUser;
    if (user) {
        // successCallback();
        return user;
    } else {
        // failCallback();
    }
};

const nativeSignUp = (email, pwd) => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, pwd)
        .then((user) => {
            // add data to userData
            const ref = db.collection('userData').doc(email);
            ref.set({
                email: email,
                canvas: [],
            }).then(() => {
                // console.log('set data successful');
            });
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // console.log(errorCode, errorMessage);
            alert('請輸入有效之email地址及6位以上密碼');
        });
};

const nativeSignIn = (email, pwd) => {
    firebase
        .auth()
        .signInWithEmailAndPassword(email, pwd)
        .then((user) => {
            return user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // console.log(errorCode, errorMessage);
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
    saveCanvasData,
    getCanvasData,
    nativeSignUp,
    nativeSignIn,
    nativeSignOut,
    checkCurrentUser,
    createNewCanvas,
    loadCanvas,
    listenCanvas,
    loadUserData,
};
