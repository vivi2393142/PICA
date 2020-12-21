import firebase from 'firebase/app';
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

// canvas
// -- listen
let initState = true;
const listenCanvas = (fileId, callback, setUploadedFiles) => {
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

// -- save data URL
const savaDataURL = (canvas, fileId, successCallback) => {
    let exportCanvas;
    if (JSON.stringify(canvas) === '{}') {
        exportCanvas = document.getElementById('fabric-canvas');
    } else {
        exportCanvas = canvas;
    }
    let dataURL = exportCanvas.toDataURL('image/png', 1);
    const storageRef = firebase
        .storage()
        .ref()
        .child('snapshot/' + fileId);
    successCallback(dataURL);
    // const newDataURL = dataURL.replace('data:image/png;base64,', '');
    // const task = storageRef.putString(newDataURL, 'base64', { contentType: 'image/jpg' });
    // task.on(
    //     'state_changed',
    //     () => {},
    //     function error(err) {},
    //     function complete() {
    //         successCallback(storageRef);
    //     }
    // );
};

// -- firestore
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
        comments: [],
        like: [],
        isSample: false,
    }).then(() => {
        // add data to userData
        const userRef = db.collection('userData').doc(userId);
        userRef.update({ canvas: firebase.firestore.FieldValue.arrayUnion(canvasSetting.id) });
        document.location.href = `../file/${canvasSetting.id}`;
    });
};
const createSampleCanvas = (canvasSetting, sampleFileId) => {
    // add data to canvasFiles
    const refSample = db.collection('canvasFiles').doc(sampleFileId);
    const ref = db.collection('canvasFiles').doc(canvasSetting.id);
    refSample.get().then((doc) => {
        const sampleData = doc.data();
        const newCanvasSetting = {
            ...doc.data().basicSetting,
            title: canvasSetting.title,
            userEmail: canvasSetting.userEmail,
            id: canvasSetting.id,
        };
        ref.set({
            data: sampleData.data,
            basicSetting: newCanvasSetting,
            uploaded: [],
            comments: [],
            like: [],
            isSample: false,
        }).then(() => {
            // add data to userData
            const userRef = db.collection('userData').doc(canvasSetting.userEmail);
            userRef.update({ canvas: firebase.firestore.FieldValue.arrayUnion(canvasSetting.id) });
            document.location.href = `/file/${canvasSetting.id}`;
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
        if (
            canvasDataInit.objects.length === 0 ||
            (canvasDataInit.objects.length !== 0 && !doc.data().snapshot)
        ) {
            savaDataURL(canvas, fileId, (dataURL) => {
                ref.update({
                    snapshot: dataURL,
                });
            });
        }
    });
};
const saveCanvasData = (canvas, canvasSetting, fileId) => {
    // save snap shot on dataURL
    savaDataURL(canvas, fileId, (dataURL) => {
        // update file data
        const canvasData = JSON.stringify(canvas.toJSON());
        const ref = db.collection('canvasFiles').doc(canvasSetting.id);
        ref.update({
            data: canvasData,
            basicSetting: canvasSetting,
            snapshot: dataURL,
        }).then(() => {});
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
const setBasicSetting = (fileId, newWidth, newHeight, newType, canvas) => {
    let result = {};
    const ref = db.collection('canvasFiles').doc(fileId);
    ref.get().then((doc) => {
        result = { ...doc.data().basicSetting, width: newWidth, height: newHeight, type: newType };
        // console.log(result);
        saveCanvasData(canvas, result, fileId);
    });
};
const deleteCanvas = (userId, fileId) => {
    const refUser = db.collection('userData').doc(userId);
    const refFiles = db.collection('canvasFiles').doc(fileId);
    refFiles.delete().then(() => {
        console.log('delete data successful');
    });
    refUser.update({
        canvas: firebase.firestore.FieldValue.arrayRemove(fileId),
    });
};

// main page
// -- firestore
const getAllFiles = (currentUserId, callback) => {
    let allUsers = [];
    let instagram = [];
    let poster = [];
    let postCard = [];
    let web = [];
    let a4 = [];
    let nameCard = [];
    let custom = [];
    const refUser = db.collection('userData');
    const refFiles = db.collection('canvasFiles');
    refUser
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                allUsers.push(doc.data());
            });
        })
        .then(() => {
            refFiles
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const userId = doc.data().basicSetting.userEmail;
                        const userData = allUsers.find((x) => x.email === userId);
                        const fileData = {
                            userId: userId,
                            userName: userData.name,
                            userPhoto: userData.photo,
                            like: doc.data().like.length,
                            comment: doc.data().comments.length,
                            fileId: doc.data().basicSetting.id,
                            snapshot: doc.data().snapshot,
                            isSample: doc.data().isSample,
                            isLike: doc.data().like.includes(currentUserId),
                        };
                        doc.data().basicSetting.type === 'instagram'
                            ? instagram.push(fileData)
                            : doc.data().basicSetting.type === 'poster'
                            ? poster.push(fileData)
                            : doc.data().basicSetting.type === 'postCard'
                            ? postCard.push(fileData)
                            : doc.data().basicSetting.type === 'web'
                            ? web.push(fileData)
                            : doc.data().basicSetting.type === 'a4'
                            ? a4.push(fileData)
                            : doc.data().basicSetting.type === 'nameCard'
                            ? nameCard.push(fileData)
                            : custom.push(fileData);
                    });
                })
                .then(() => {
                    const dataArray = {
                        Instagram: instagram,
                        Poster: poster,
                        PostCard: postCard,
                        Web: web,
                        A4: a4,
                        NameCard: nameCard,
                        Custom: custom,
                    };
                    callback(dataArray);
                });
        });
};
const getShot = (fileId, currentUserEmail, callback) => {
    const refUser = db.collection('userData');
    const refFile = db.collection('canvasFiles').doc(fileId);
    let allUsers = [];
    refUser
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                allUsers.push(doc.data());
            });
        })
        .then(() => {
            refFile.get().then((doc) => {
                const author = allUsers.find((x) => x.email === doc.data().basicSetting.userEmail);
                const currentUser = allUsers.find((x) => x.email === currentUserEmail);
                const comments = doc.data().comments.map((comment) => {
                    const commenter = allUsers.find((x) => x.email === comment.userId);
                    comment.userPhoto = commenter.photo;
                    comment.userName = commenter.name;
                    return comment;
                });
                const result = {
                    file: {
                        fileImg: doc.data().snapshot,
                        fileName: doc.data().basicSetting.title,
                        userPhoto: author.photo,
                        userName: author.name,
                        userId: author.email,
                        fileNumber: author.canvas.length,
                    },
                    comments: comments,
                    currentUser: {
                        userPhoto: currentUser && currentUser.photo,
                        isLike: currentUser && currentUser.like.includes(fileId),
                    },
                };
                callback(result);
            });
        });
};
const postComment = (textInput, currentUserId, fileId) => {
    const refFiles = db.collection('canvasFiles').doc(fileId);
    refFiles
        .update({
            latestTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            refFiles.get().then((doc) => {
                const newComment = {
                    content: textInput,
                    userId: currentUserId,
                    timestamp: doc.data().latestTimestamp,
                };
                refFiles.update({
                    comments: firebase.firestore.FieldValue.arrayUnion(newComment),
                });
            });
        });
};
let setTime = 0;
let initCommentState = true;
const listenToComment = (fileId, callback) => {
    const refUser = db.collection('userData');
    const refFiles = db.collection('canvasFiles').doc(fileId);
    let allUsers = [];
    let oldData = [];
    // 不重複設置監聽
    if (setTime < 1) {
        setTime += 1;
        refFiles.onSnapshot((doc) => {
            if (initCommentState) {
                initCommentState = false;
                oldData = doc.data();
            } else if (doc.data().comments.length !== oldData.comments.length) {
                callback();
                oldData = doc.data();
            }
        });
    }
};
const deleteComment = (index, fileId) => {
    const ref = db.collection('canvasFiles').doc(fileId);
    ref.get().then((doc) => {
        let newData = doc.data();
        newData.comments.splice(index, 1);
        ref.update(newData);
    });
};
const postLike = (currentUserId, fileId, oldIsLike) => {
    const refFile = db.collection('canvasFiles').doc(fileId);
    const refUser = db.collection('userData').doc(currentUserId);
    if (oldIsLike) {
        refFile.update({
            like: firebase.firestore.FieldValue.arrayRemove(currentUserId),
        });
        refUser.update({
            like: firebase.firestore.FieldValue.arrayRemove(fileId),
        });
    } else {
        refFile.update({
            like: firebase.firestore.FieldValue.arrayUnion(currentUserId),
        });
        refUser.update({
            like: firebase.firestore.FieldValue.arrayUnion(fileId),
        });
    }
};
const getLikeList = (userId, callback) => {
    let allUsers = [];
    let result = [];
    let currentUserLike = [];
    const refUser = db.collection('userData');
    const refFiles = db.collection('canvasFiles');
    refUser
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                allUsers.push(doc.data());
                if (doc.id === userId) {
                    currentUserLike = doc.data().like;
                }
            });
        })
        .then(() => {
            refFiles
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (currentUserLike.includes(doc.id)) {
                            const userData = allUsers.find(
                                (x) => x.email === doc.data().basicSetting.userEmail
                            );
                            const fileData = {
                                userId: userData.id,
                                userName: userData.name,
                                userPhoto: userData.photo,
                                like: doc.data().like.length,
                                comment: doc.data().comments.length,
                                fileId: doc.data().basicSetting.id,
                                snapshot: doc.data().snapshot,
                                isSample: doc.data().isSample,
                                isLike: doc.data().like.includes(userId),
                            };
                            result.push(fileData);
                        }
                    });
                })
                .then(() => {
                    callback(result);
                });
        });
};
const getSampleList = (type, callback) => {
    let result = [];
    const refFiles = db.collection('canvasFiles');
    refFiles
        .where('isSample', '==', true)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().basicSetting.type === type) {
                    result.push(doc.data());
                }
            });
            callback(result);
        });
};
const getSingleSample = (fileId, callback) => {
    const refFile = db.collection('canvasFiles').doc(fileId);
    refFile.get().then((doc) => {
        callback(doc.data().data);
    });
};
const changeTitle = (fileId, newTitle) => {
    const refFile = db.collection('canvasFiles').doc(fileId);
    refFile.get().then((doc) => {
        let allSetting = doc.data().basicSetting;
        allSetting.title = newTitle;
        refFile.update({
            basicSetting: allSetting,
        });
    });
};
const getUserPhoto = (userId, callback) => {
    const refUser = db.collection('userData').doc(userId);
    refUser.get().then((doc) => {
        callback(doc.data().photo);
    });
};

// auth
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
            // if it's sign up, set basic data
            if (result.additionalUserInfo.isNewUser) {
                ref.set({
                    photo:
                        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/userPhoto%2Fboy.svg?alt=media&token=fd4f1dc8-2ad2-4135-aaee-5b59265bc6ea',
                    name: result.user.displayName,
                    email: result.user.email,
                    canvas: [],
                    like: [],
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
                    photo:
                        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/userPhoto%2Fboy.svg?alt=media&token=fd4f1dc8-2ad2-4135-aaee-5b59265bc6ea',
                    name: result.user.displayName,
                    email: result.user.email,
                    canvas: [],
                    like: [],
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
                like: [],
            }).then(() => {
                // console.log('set data successful');
            });
            return user;
        })
        .catch((error) => {
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
const uploadToStorage = (filesList, fileId, callback, successCallback, failCallback) => {
    const imgId = nanoid();
    const file = filesList[0];
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
            console.log('上傳失敗');
        },
        function complete() {
            successCallback();
            console.log('上傳成功');
            // get upload URL and set into firestore data
            storageRef.getDownloadURL().then((url) => {
                const ref = db.collection('canvasFiles').doc(fileId);
                ref.update({
                    uploaded: firebase.firestore.FieldValue.arrayUnion({
                        src: url,
                        path: `${fileId}/${imgId}`,
                    }),
                }).then(() => {});
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
                successCallback(url);
                ref.update({
                    photo: url,
                }).then(() => {});
            });
        }
    );
};
const removeUploadImg = (e, fileId) => {
    const storageRef = firebase.storage().ref().child(e.target.id);
    storageRef
        .delete()
        .then(() => {
            // get upload URL and set into firestore data
            const ref = db.collection('canvasFiles').doc(fileId);
            ref.get().then((doc) => {
                const newUploaded = doc.data().uploaded.filter((item) => item.path !== e.target.id);
                ref.update({
                    uploaded: newUploaded,
                }).then(() => {});
            });
        })
        .catch(function (error) {});
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
    uploadToStorage,
    removeUploadImg,
    getAllCanvasData,
    fbSignUp,
    googleSignUp,
    uploadUserPhoto,
    setBasicSetting,
    getAllFiles,
    getShot,
    postComment,
    postLike,
    getLikeList,
    deleteComment,
    getSampleList,
    createSampleCanvas,
    deleteCanvas,
    changeTitle,
    listenToComment,
    getUserPhoto,
    getSingleSample,
};
