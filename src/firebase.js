import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { nanoid } from 'nanoid';

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

// save data URL
const savaDataURL = (canvas, fileId, successCallback) => {
    const exportCanvas = document.getElementById('fabric-canvas');
    let dataURL = exportCanvas.toDataURL('image/jpeg', 1);
    const storageRef = firebase
        .storage()
        .ref()
        .child('snapshot/' + fileId);
    const newDataURL = dataURL.replace('data:image/jpeg;base64,', '');
    const task = storageRef.putString(newDataURL, 'base64', { contentType: 'image/jpg' });
    task.on(
        'state_changed',
        () => {},
        function error(err) {},
        function complete() {
            successCallback(storageRef);
        }
    );
};

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
        uploaded: [],
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

const loadCanvas = (canvas, callback, fileId) => {
    const ref = firebase.firestore().collection('canvasFiles').doc(fileId);
    ref.get().then((doc) => {
        const dataFromFirebase = doc.data();
        const canvasSettingInit = dataFromFirebase.basicSetting;
        const canvasDataInit = JSON.parse(dataFromFirebase.data);
        callback(canvasSettingInit, canvasDataInit);
        if (canvasDataInit.objects.length === 0) {
            savaDataURL(canvas, fileId, (storageRef) => {
                storageRef.getDownloadURL().then((url) => {
                    const ref = db.collection('canvasFiles').doc(fileId);
                    ref.get().then((doc) => {
                        ref.update({
                            snapshot: url,
                        }).then(() => {});
                    });
                });
            });
        }
    });
};

let initState = true;
const listenCanvas = (fileId, callback, setUploadedFiles) => {
    // console.log('設定監聽事件');
    const ref = firebase.firestore().collection('canvasFiles').doc(fileId);
    let oldData = [];
    ref.onSnapshot((doc) => {
        if (doc.data().uploaded !== oldData.uploaded) {
            setUploadedFiles(doc.data().uploaded);
        }
        oldData = doc.data();
        if (initState) {
            // 不回應第一次監聽
            initState = false;
        } else {
            console.log('文件更新');
            callback();
        }
    });
};

const saveCanvasData = (canvas, canvasSetting, fileId) => {
    // save snap shot on storage
    savaDataURL(canvas, fileId, (storageRef) => {
        storageRef.getDownloadURL().then((url) => {
            // update file data
            const canvasData = JSON.stringify(canvas.toJSON());
            const ref = db.collection('canvasFiles').doc(canvasSetting.id);
            ref.update({
                data: canvasData,
                basicSetting: canvasSetting,
                snapshot: url,
            }).then(() => {});
        });
    });
};

const getCanvasData = (id, callback) => {
    const ref = db.collection('canvasFiles').doc(id);
    ref.get().then((doc) => {
        return doc.data();
    });
};

const getAllCanvasData = (callback) => {
    const ref = db.collection('canvasFiles');
    let result = [];
    ref.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            result.push(doc.data());
        });
        callback(result);
    });
};

const setBasicSetting = (fileId, newWidth, newHeight, canvas) => {
    let result = {};
    const ref = db.collection('canvasFiles').doc(fileId);
    ref.get().then((doc) => {
        result = { ...doc.data().basicSetting, width: newWidth, height: newHeight };
        saveCanvasData(canvas, result, fileId);
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

const fbSignUp = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
            const ref = db.collection('userData').doc(result.user.email);
            // if user had edit photo before, don't renew fb photo
            ref.get().then((doc) => {
                if (doc.data().photo.slice(0, 10) === 'https://gr') {
                    const userPhoto = `https://graph.facebook.com/${result.additionalUserInfo.profile.id}/picture?access_token=${result.credential.accessToken}&width=700`;
                    ref.update({
                        photo: userPhoto,
                    });
                }
            });
            // if it's sign up, set basic data
            if (result.additionalUserInfo.isNewUser) {
                ref.set({
                    name: result.user.displayName,
                    email: result.user.email,
                    canvas: [],
                });
            }
            return user;
        })
        .catch(function (error) {});
};

const googleSignUp = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
            if (result.additionalUserInfo.isNewUser) {
                const ref = db.collection('userData').doc(result.user.email);
                ref.set({
                    photo: result.user.photoURL,
                    name: result.user.displayName,
                    email: result.user.email,
                    canvas: [],
                });
            }
            return user;
        })
        .catch(function (error) {});
};

const nativeSignUp = (name, email, pwd) => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, pwd)
        .then((user) => {
            // add data to userData
            const ref = db.collection('userData').doc(email);
            ref.set({
                photo:
                    'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/userPhoto%2Fboy.svg?alt=media&token=fd4f1dc8-2ad2-4135-aaee-5b59265bc6ea',
                name: name,
                email: email,
                canvas: [],
            }).then(() => {
                // console.log('set data successful');
            });
            return user;
        })
        .catch((error) => {
            // const errorCode = error.code;
            // const errorMessage = error.message;
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

// storage
const storage = firebase.storage();
const uploadToStorage = (e, fileId, callback, successCallback, failCallback) => {
    const imgId = nanoid();
    const file = e.target.files[0];
    const storageRef = firebase
        .storage()
        .ref()
        .child(fileId + '/' + imgId);
    const task = storageRef.put(file);
    // listen to progress
    task.on(
        'state_changed',
        (snapshot) => {
            let uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            callback(uploadValue.toFixed(0));
        },
        function error(err) {
            // console.log('上傳失敗');
        },
        function complete() {
            successCallback();
            // console.log('上傳成功');
            // get upload URL and set into firestore data
            storageRef.getDownloadURL().then((url) => {
                const ref = db.collection('canvasFiles').doc(fileId);
                ref.get().then((doc) => {
                    let oldUploaded = [...doc.data().uploaded];
                    oldUploaded.push({ src: url, path: `${fileId}/${imgId}` });
                    // console.log(oldUploaded);
                    ref.update({
                        uploaded: oldUploaded,
                    }).then(() => {});
                });
            });
        }
    );
};

const uploadUserPhoto = (e, email, successCallback) => {
    const imgId = nanoid();
    const file = e.target.files[0];
    const storageRef = firebase
        .storage()
        .ref()
        .child('userPhoto/' + imgId);
    const task = storageRef.put(file);
    // listen to progress
    task.on(
        'state_changed',
        (snapshot) => {},
        function error(err) {},
        function complete() {
            storageRef.getDownloadURL().then((url) => {
                const ref = db.collection('userData').doc(email);
                ref.get().then((doc) => {
                    successCallback(url);
                    ref.update({
                        photo: url,
                    }).then(() => {});
                });
            });
        }
    );
};

const removeUploadImg = (e, fileId) => {
    const storageRef = firebase.storage().ref().child(e.target.id);
    storageRef
        .delete()
        .then(() => {
            // console.log('刪除成功');
            // get upload URL and set into firestore data
            const ref = db.collection('canvasFiles').doc(fileId);
            ref.get().then((doc) => {
                const newUploaded = doc.data().uploaded.filter((item) => item.path !== e.target.id);
                ref.update({
                    uploaded: newUploaded,
                }).then(() => {});
            });
        })
        .catch(function (error) {
            // console.log('刪除失敗');
        });
};

// const testSaveDataURL = (dataURL, fileId) => {
//     const storageRef = firebase
//         .storage()
//         .ref()
//         .child('snapshot/' + fileId);
//     let newDataURL = dataURL.replace('data:image/jpeg;base64,', '');
//     const task = storageRef.putString(newDataURL, 'base64', { contentType: 'image/jpg' });
// };

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
    uploadToStorage,
    removeUploadImg,
    getAllCanvasData,
    fbSignUp,
    googleSignUp,
    uploadUserPhoto,
    setBasicSetting,
};
