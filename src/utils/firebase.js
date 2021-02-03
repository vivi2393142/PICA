import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { nanoid } from 'nanoid';
import { firebaseConfig } from './firebaseConfig';

// init firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const userDb = db.collection('userData');
const filesDb = db.collection('canvasFiles');

// refactor: change explore page data to redux
export const getUsers = (callback) => {
    const users = [];
    userDb
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
        })
        .then(() => {
            callback(users);
        });
};
export const getFiles = (callback) => {
    const files = [];
    filesDb
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                files.push(doc.data());
            });
        })
        .then(() => {
            callback(files);
        });
};

export const mapDataForExplore = (currentUserId, files, allUsers) => {
    // const allUsers = [];
    const instagram = [];
    const poster = [];
    const postCard = [];
    const web = [];
    const a4 = [];
    const nameCard = [];
    const custom = [];
    files.forEach((file) => {
        const userId = file.basicSetting.userEmail;
        const userData = allUsers.find((x) => x.email === userId);
        const fileData = {
            userId: userId,
            userName: userData ? userData.name : '',
            userPhoto: userData ? userData.photo : '',
            like: file.like.length,
            comment: file.comments.length,
            fileId: file.basicSetting.id,
            snapshot: file.snapshot,
            isSample: file.isSample,
            isLike: file.like.includes(currentUserId),
        };
        file.basicSetting.type === 'instagram'
            ? instagram.push(fileData)
            : file.basicSetting.type === 'poster'
            ? poster.push(fileData)
            : file.basicSetting.type === 'postCard'
            ? postCard.push(fileData)
            : file.basicSetting.type === 'web'
            ? web.push(fileData)
            : file.basicSetting.type === 'a4'
            ? a4.push(fileData)
            : file.basicSetting.type === 'nameCard'
            ? nameCard.push(fileData)
            : custom.push(fileData);
    });
    const dataObject = {
        Instagram: instagram,
        Poster: poster,
        PostCard: postCard,
        Web: web,
        A4: a4,
        NameCard: nameCard,
        Custom: custom,
    };
    return dataObject;
};
export const mapCurrentUser = (users, userId) => {
    const currentUser = users.find((user) => user.email === userId);
    return currentUser;
};
export const mapLikeList = (allUsers, files, userId) => {
    const result = [];
    const currentUser = allUsers.find((user) => user.email === userId);
    const currentUserLike = currentUser.like;
    files.forEach((file) => {
        if (currentUserLike.includes(file.basicSetting.id)) {
            const userData = allUsers.find((x) => x.email === file.basicSetting.userEmail);
            const fileData = {
                userId: userData.email,
                userName: userData.name,
                userPhoto: userData.photo,
                like: file.like.length,
                comment: file.comments.length,
                fileId: file.basicSetting.id,
                snapshot: file.snapshot,
                isSample: file.isSample,
                isLike: file.like.includes(userId),
            };
            result.push(fileData);
        }
    });
    return result;
};
export const mapOwnFilesData = (allUsers, files, userId) => {
    const currentUser = allUsers.find((user) => user.email === userId);
    if (currentUser.canvas[0] !== '') {
        const userFiles = currentUser.canvas.map((item) => {
            const fileData = files.find((file) => file.basicSetting.id === item);
            return {
                comments: fileData.comments,
                like: fileData.like,
                fileId: item,
                snapshot: fileData.snapshot,
                title:
                    fileData.basicSetting.title === '' ? '未命名畫布' : fileData.basicSetting.title,
            };
        });
        return userFiles;
    }
};
// canvas
// -- listen canvas update
let initState = true;
export const listenCanvas = (fileId, setUploadedFiles, callback) => {
    const ref = filesDb.doc(fileId);
    let oldData = [];
    const unsubscribe = ref.onSnapshot((doc) => {
        if (doc.data()) {
            if (doc.data().uploaded !== oldData.uploaded) {
                setUploadedFiles(doc.data().uploaded);
            }
            oldData = doc.data();
            if (initState) {
                // 不回應第一次監聽
                initState = false;
            } else {
                callback();
            }
        }
    });
    return unsubscribe;
};
// -- save data URL
export const savaDataURL = (canvas, fileId, successCallback) => {
    let exportCanvas;
    if (JSON.stringify(canvas) === '{}') {
        exportCanvas = document.getElementById('fabric-canvas');
    } else {
        exportCanvas = canvas;
    }
    const dataURL = exportCanvas.toDataURL('image/png', 1);
    successCallback(dataURL);
};
// -- save data URL
export const firstSavaDataURL = (canvas, fileId) => {
    let exportCanvas;
    if (JSON.stringify(canvas) === '{}') {
        exportCanvas = document.getElementById('fabric-canvas');
    } else {
        exportCanvas = canvas;
    }
    const dataURL = exportCanvas.toDataURL('image/png', 1);
    const ref = filesDb.doc(fileId);
    ref.update({
        snapshot: dataURL,
    });
};
// -- firestore
export const loadUserData = (userId, callback) => {
    const ref = userDb.doc(userId);
    ref.get().then((doc) => {
        const dataFromFirebase = doc.data();
        callback(dataFromFirebase);
    });
};
export const createNewCanvas = (canvasSetting, userId) => {
    // add data to canvasFiles
    const ref = filesDb.doc(canvasSetting.id);
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
        const userRef = userDb.doc(userId);
        userRef.update({ canvas: firebase.firestore.FieldValue.arrayUnion(canvasSetting.id) });
        document.location.href = `/file/${canvasSetting.id}`;
    });
};
export const createSampleCanvas = (canvasSetting, sampleFileId) => {
    // add data to canvasFiles
    const refSample = filesDb.doc(sampleFileId);
    const ref = filesDb.doc(canvasSetting.id);
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
export const loadCanvas = (canvas, callback, fileId) => {
    const ref = filesDb.doc(fileId);
    ref.get().then((doc) => {
        const dataFromFirebase = doc.data();
        const canvasSettingInit = dataFromFirebase.basicSetting;
        const canvasDataInit = JSON.parse(dataFromFirebase.data);
        const snapshotInit = dataFromFirebase.snapshot ? dataFromFirebase.snapshot : null;
        callback(canvasSettingInit, canvasDataInit, snapshotInit);
    });
};
export const saveCanvasData = (canvas, canvasSetting, fileId) => {
    // save snap shot on dataURL
    savaDataURL(canvas, fileId, (dataURL) => {
        // update file data
        const canvasData = JSON.stringify(canvas.toJSON());
        const ref = filesDb.doc(canvasSetting.id);
        ref.update({
            data: canvasData,
            basicSetting: canvasSetting,
            snapshot: dataURL,
        }).then(() => {});
    });
};
export const setBasicSetting = (fileId, newWidth, newHeight, newType, canvas) => {
    let result = {};
    const ref = filesDb.doc(fileId);
    ref.get().then((doc) => {
        result = { ...doc.data().basicSetting, width: newWidth, height: newHeight, type: newType };
        saveCanvasData(canvas, result, fileId);
    });
};
export const deleteCanvas = (userId, fileId) => {
    const refUser = userDb.doc(userId);
    const refFiles = filesDb.doc(fileId);
    refFiles.delete().then(() => {});
    refUser.update({
        canvas: firebase.firestore.FieldValue.arrayRemove(fileId),
    });
};

// main page
// -- firestore
export const getAllFiles = (currentUserId, callback) => {
    const allUsers = [];
    const instagram = [];
    const poster = [];
    const postCard = [];
    const web = [];
    const a4 = [];
    const nameCard = [];
    const custom = [];
    userDb
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                allUsers.push(doc.data());
            });
        })
        .then(() => {
            filesDb
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const userId = doc.data().basicSetting.userEmail;
                        const userData = allUsers.find((x) => x.email === userId);
                        const fileData = {
                            userId: userId,
                            userName: userData ? userData.name : '',
                            userPhoto: userData ? userData.photo : '',
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
                    const dataObject = {
                        Instagram: instagram,
                        Poster: poster,
                        PostCard: postCard,
                        Web: web,
                        A4: a4,
                        NameCard: nameCard,
                        Custom: custom,
                    };
                    callback(dataObject);
                });
        });
};
export const getShot = (fileId, currentUserEmail, callback) => {
    const refFile = filesDb.doc(fileId);
    const allUsers = [];
    userDb
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
export const postComment = (textInput, currentUserId, fileId) => {
    const refFiles = filesDb.doc(fileId);
    refFiles.get().then((doc) => {
        const newComment = {
            content: textInput,
            userId: currentUserId,
            timestamp: new Date(),
        };
        refFiles.update({
            comments: firebase.firestore.FieldValue.arrayUnion(newComment),
        });
    });
};

export const listenToComment = (fileId, callback) => {
    const refFiles = filesDb.doc(fileId);
    let oldData = [];
    refFiles.onSnapshot((doc) => {
        if (oldData.length === 0) {
            oldData = doc.data();
        } else if (doc.data().comments.length !== oldData.comments.length) {
            callback();
            oldData = doc.data();
        }
    });
};
export const deleteComment = (index, fileId) => {
    const ref = filesDb.doc(fileId);
    ref.get().then((doc) => {
        const newData = doc.data();
        newData.comments.splice(index, 1);
        ref.update(newData);
    });
};
export const postLike = (currentUserId, fileId, oldIsLike) => {
    const refFile = filesDb.doc(fileId);
    const refUser = userDb.doc(currentUserId);
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
export const getLikeList = (userId, callback, isNoLikeCallback) => {
    const allUsers = [];
    const result = [];
    let currentUserLike = [];
    userDb
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
            filesDb
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (currentUserLike.includes(doc.id)) {
                            const userData = allUsers.find(
                                (x) => x.email === doc.data().basicSetting.userEmail
                            );
                            const fileData = {
                                userId: userData.email,
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
export const getSampleList = (type, callback) => {
    const result = [];
    filesDb
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
export const getSingleSample = (fileId, callback) => {
    const refFile = filesDb.doc(fileId);
    refFile.get().then((doc) => {
        callback(doc.data().data);
    });
};
const getAllCanvasData = (callback) => {
    const result = [];
    filesDb.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            result.push(doc.data());
        });
        callback(result);
    });
};
export const getOwnFilesData = (userDataFromFirebase, callback) => {
    getAllCanvasData((result) => {
        if (userDataFromFirebase.canvas[0] !== '') {
            const canvasDataWithImg = userDataFromFirebase.canvas.map((item) => {
                const fileData = result.find((data) => data.basicSetting.id === item);
                return {
                    comments: fileData.comments,
                    like: fileData.like,
                    fileId: item,
                    snapshot: fileData.snapshot,
                    title:
                        fileData.basicSetting.title === ''
                            ? '未命名畫布'
                            : fileData.basicSetting.title,
                };
            });
            callback(canvasDataWithImg);
        }
    });
};
export const changeTitle = (fileId, newTitle) => {
    const refFile = filesDb.doc(fileId);
    refFile.get().then((doc) => {
        const allSetting = doc.data().basicSetting;
        allSetting.title = newTitle;
        refFile.update({
            basicSetting: allSetting,
        });
    });
};
export const getUserPhoto = (userId, callback) => {
    const refUser = userDb.doc(userId);
    refUser.get().then((doc) => {
        if (doc.data()) {
            callback(doc.data().photo);
        } else {
            callback(
                'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/userPhoto%2Fboy.svg?alt=media&token=fd4f1dc8-2ad2-4135-aaee-5b59265bc6ea'
            );
        }
    });
};

// auth
export const fbSignUp = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
            const ref = userDb.doc(result.user.email);
            ref.get().then((doc) => {
                if (!doc.data()) {
                    ref.set({
                        photo:
                            'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/userPhoto%2Fboy.svg?alt=media&token=fd4f1dc8-2ad2-4135-aaee-5b59265bc6ea',
                        name: result.user.displayName,
                        email: result.user.email,
                        canvas: [],
                        like: [],
                    });
                }
            });
        })
        // .then(() => history.go(0))
        .catch(function (error) {});
};
export const googleSignUp = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
            const ref = userDb.doc(result.user.email);
            ref.get().then((doc) => {
                if (!doc.data()) {
                    ref.set({
                        photo:
                            'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/userPhoto%2Fboy.svg?alt=media&token=fd4f1dc8-2ad2-4135-aaee-5b59265bc6ea',
                        name: result.user.displayName,
                        email: result.user.email,
                        canvas: [],
                        like: [],
                    });
                }
            });
        })
        // .then(() => history.go(0))
        .catch(function (error) {});
};
export const nativeSignUp = (name, email, pwd, failCallback) => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, pwd)
        .then((user) => {
            // add data to userData
            const ref = userDb.doc(email);
            ref.set({
                photo:
                    'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/userPhoto%2Fboy.svg?alt=media&token=fd4f1dc8-2ad2-4135-aaee-5b59265bc6ea',
                name: name,
                email: email,
                canvas: [],
                like: [],
            }).then(() => {
                history.go(0);
            });
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                failCallback('該帳號已註冊');
            } else {
                failCallback('請輸入有效之email地址及6位以上密碼');
            }
        });
};
export const nativeSignIn = (email, pwd, failCallback) => {
    firebase
        .auth()
        .signInWithEmailAndPassword(email, pwd)
        .then(() => {
            history.go(0);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            failCallback();
        });
};
export const nativeSignOut = (successCallback) => {
    firebase
        .auth()
        .signOut()
        .then(
            function () {
                successCallback();
            },
            function (error) {}
        );
};

// storage
export const uploadToStorage = (filesList, fileId, callback, successCallback, failCallback) => {
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
            const uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            callback(uploadValue.toFixed(0));
        },
        function error(err) {},
        function complete() {
            successCallback();
            // get upload URL and set into firestore data
            storageRef.getDownloadURL().then((url) => {
                const ref = filesDb.doc(fileId);
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
export const uploadUserPhoto = (e, email, successCallback) => {
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
                const ref = userDb.doc(email);
                successCallback(url);
                ref.update({
                    photo: url,
                }).then(() => {});
            });
        }
    );
};
export const removeUploadImg = (e, fileId) => {
    const storageRef = firebase.storage().ref().child(e.target.id);
    storageRef
        .delete()
        .then(() => {
            // get upload URL and set into firestore data
            const ref = filesDb.doc(fileId);
            ref.get().then((doc) => {
                const newUploaded = doc.data().uploaded.filter((item) => item.path !== e.target.id);
                ref.update({
                    uploaded: newUploaded,
                }).then(() => {});
            });
        })
        .catch(function (error) {});
};
