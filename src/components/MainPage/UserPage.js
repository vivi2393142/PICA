import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as firebase from '../../utils/firebase.js';
import Loader from '../Loader';
import ExploreItem from './ExploreItem';
import TitleInput from './TitleInput';
import * as mainIcons from '../../img/mainPage';
import { useHistory } from 'react-router-dom';
import { Alert, defaultAlertSetting } from '../Alert';

const UserPage = (props) => {
    const history = useHistory();
    const [isLoaded, setIsLoaded] = React.useState(true);
    const [isSmallLoaded, setIsSmallLoaded] = React.useState(false);
    const [isAtMyCanvas, setIsAtMyCanvas] = React.useState(true);
    const [isLikeLoader, setIsLikeLoader] = React.useState(true);
    const [showAlert, setShowAlert] = React.useState(false);
    const [likeList, setLikeList] = React.useState([]);
    const [userDataFromFirebase, setUserDataFromFirebase] = React.useState({ canvas: [] });
    const [canvasDataWithDataURL, setCanvasDataWithDataURL] = React.useState([]);
    const [userPhoto, setUserPhoto] = React.useState('');
    const [alertSetting, setAlertSetting] = React.useState({
        ...defaultAlertSetting,
    });

    React.useEffect(() => {
        // not login alert
        if (props.currentUser.email === 'noUser') {
            setAlertSetting({
                buttonNumber: 1,
                buttonOneFunction: () => {
                    history.push('/main/explore');
                },
                buttonTwoFunction: () => {},
                buttonOneTitle: '關閉',
                buttonTwoTitle: '',
                title: '未登入會員',
                content: '請先註冊或登入會員，以檢視我的畫布',
            });
            setIsLoaded(false);
            setShowAlert(true);
        }
        // set current page tag
        props.currentUser.email === props.match.params.userId
            ? props.setCurrentPage('user')
            : props.setCurrentPage('explore');
        // get user data
        firebase.loadUserData(props.match.params.userId, (dataFromFirebase) => {
            if (dataFromFirebase) {
                setUserDataFromFirebase(dataFromFirebase);
                setUserPhoto(dataFromFirebase.photo);
                setIsLoaded(false);
            }
        });
        // get like list
        if (props.currentUser) {
            firebase.getLikeList(props.match.params.userId, (result) => {
                setLikeList(result);
                setIsLikeLoader(false);
            });
        }
    }, [props.currentUser]);

    React.useEffect(() => {
        firebase.getOwnFilesData(userDataFromFirebase, (canvasDataWithImg) => {
            setCanvasDataWithDataURL(canvasDataWithImg);
        });
    }, [userDataFromFirebase.canvas]);

    const handleUploadImage = (e) => {
        setIsSmallLoaded(true);
        const fileSizeLimit = 2097152;
        if (e.target.files[0].size > fileSizeLimit) {
            setAlertSetting({
                buttonNumber: 1,
                buttonOneFunction: () => {
                    setShowAlert(false);
                },
                buttonTwoFunction: () => {},
                buttonOneTitle: '關閉',
                buttonTwoTitle: '',
                title: '上傳錯誤',
                content: '請勿上傳超過2mb之圖片',
            });
            setIsSmallLoaded(false);
            setShowAlert(true);
        } else {
            firebase.uploadUserPhoto(e, props.match.params.userId, (url) => {
                setUserPhoto(url);
                setIsSmallLoaded(false);
            });
        }
    };
    const deleteHandler = (e, fileId) => {
        e.stopPropagation();
        const alertCallback = () => {
            setShowAlert(false);
            firebase.deleteCanvas(props.currentUser.email, fileId);
            const newFilesData = canvasDataWithDataURL.filter((item) => item.fileId !== fileId);
            setCanvasDataWithDataURL(newFilesData);
        };
        setAlertSetting({
            buttonNumber: 2,
            buttonOneFunction: alertCallback,
            buttonTwoFunction: () => {
                setShowAlert(false);
                return;
            },
            buttonOneTitle: '確定刪除',
            buttonTwoTitle: '取消刪除',
            title: '確定要刪除檔案嗎？',
            content: '一但刪除將無法復原檔案，請確認是否刪除',
        });
        setShowAlert(true);
    };
    const likeHandler = (e, item, type) => {
        firebase.postLike(props.currentUser.email, item.fileId, item.isLike);
        const newData = likeList.filter((file) => file.fileId !== item.fileId);
        setLikeList(newData);
    };

    const likeListJsx =
        likeList.length === 0 ? (
            <div className={styles.noLike}>尚無收藏畫布</div>
        ) : (
            likeList.map((item, index) => {
                return (
                    <ExploreItem
                        isLikeLoader={isLikeLoader}
                        setIsLikeLoader={setIsLikeLoader}
                        key={index}
                        index={index}
                        length={length}
                        item={item}
                        likeHandler={likeHandler}
                        className={styles.likeItem}
                        currentUser={props.currentUser}
                        isNotSameAsCurrentUser={
                            props.currentUser.email !== props.match.params.userId
                        }
                        parentNodeForClass={'user'}
                    />
                );
            })
        );
    const canvasFilesJsx =
        canvasDataWithDataURL.length !== 0 &&
        canvasDataWithDataURL.map((item, index) => {
            return (
                <div
                    key={index}
                    className={styles.fileWrapper}
                    style={{
                        animationDelay: `${index * 0.05}s`,
                    }}
                >
                    <div
                        className={styles.file}
                        onClick={() => {
                            props.currentUser.email === props.match.params.userId
                                ? history.push(`/file/${item.fileId}`)
                                : history.push(`/main/shots/${item.fileId}`);
                        }}
                        style={
                            props.currentUser.email !== props.match.params.userId
                                ? { cursor: 'pointer' }
                                : {}
                        }
                    >
                        <img src={item.snapshot} className={styles.fileImg}></img>
                        <div className={styles.hoverIconsWrapper}>
                            <mainIcons.Like className={styles.hoverIcon} />
                            <div className={styles.text}>{item.like.length}</div>
                            <mainIcons.Comment className={styles.hoverIcon} />
                            <div className={styles.text}> {item.comments.length}</div>
                            <mainIcons.Show
                                className={`${styles.hoverIcon} ${styles.boxIcon}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    history.push(`/main/shots/${item.fileId}`);
                                }}
                            />
                            {props.currentUser.email === props.match.params.userId && (
                                <mainIcons.Delete
                                    className={`${styles.hoverIcon} ${styles.boxIcon}`}
                                    onClick={(e) => deleteHandler(e, item.fileId)}
                                />
                            )}
                        </div>
                    </div>
                    <TitleInput initialValue={item.title} fileId={item.fileId} />
                </div>
            );
        });

    // render
    return (
        <div className={styles.mainPage}>
            {isLoaded && <Loader></Loader>}
            {showAlert && (
                <Alert
                    buttonNumber={alertSetting.buttonNumber}
                    buttonOneFunction={alertSetting.buttonOneFunction}
                    buttonTwoFunction={alertSetting.buttonTwoFunction}
                    buttonOneTitle={alertSetting.buttonOneTitle}
                    buttonTwoTitle={alertSetting.buttonTwoTitle}
                    title={alertSetting.title}
                    content={alertSetting.content}
                />
            )}
            <div className={styles.mainWrapper}>
                <div className={styles.main}>
                    <div className={styles.memberDetails}>
                        <div className={styles.memberPhotoWrapper}>
                            {isSmallLoaded && (
                                <div className={styles.loaderWrapper}>
                                    <div className={styles.smallLoader}>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            )}
                            <img src={userPhoto} className={styles.memberPhoto}></img>
                            {props.currentUser.email === props.match.params.userId && (
                                <label>
                                    <input
                                        type='file'
                                        accept='image/png, image/jpeg'
                                        onChange={handleUploadImage}
                                    ></input>
                                </label>
                            )}
                        </div>
                        <div className={styles.otherDetailsName}>{userDataFromFirebase.name}</div>
                        <div className={styles.otherDetails}>{userDataFromFirebase.email}</div>
                        <div className={styles.otherDetails}>
                            {canvasDataWithDataURL.length} files
                        </div>
                    </div>
                    <div className={styles.navTags}>
                        <div
                            className={`${styles.tag} ${isAtMyCanvas ? styles.currentTag : ''}`}
                            onClick={() => {
                                setIsAtMyCanvas(true);
                                // setIsLikeLoader(true);
                            }}
                        >
                            {props.currentUser.email === props.match.params.userId
                                ? '我的畫布'
                                : '他的畫布'}
                        </div>
                        <div
                            className={`${styles.tag} ${isAtMyCanvas ? '' : styles.currentTag}`}
                            onClick={() => {
                                setIsAtMyCanvas(false);
                            }}
                        >
                            {props.currentUser.email === props.match.params.userId
                                ? '我的收藏'
                                : '他的收藏'}
                        </div>
                    </div>
                    {!isAtMyCanvas && (
                        <div
                            className={styles.canvasLikesFiles}
                            style={{ display: isLikeLoader ? 'none' : 'block' }}
                        >
                            {likeListJsx}
                        </div>
                    )}
                    {!isAtMyCanvas && isLikeLoader && (
                        <div className={styles.smallLoaderLike}>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    )}

                    {canvasFilesJsx && isAtMyCanvas ? (
                        <div className={styles.canvasFiles}>
                            {canvasFilesJsx}
                            {props.currentUser.email === props.match.params.userId && (
                                <div
                                    className={styles.fileWrapperNew}
                                    style={{
                                        animationDelay: `${canvasDataWithDataURL.length * 0.05}s`,
                                    }}
                                >
                                    <div
                                        className={styles.addNew}
                                        onClick={() => {
                                            props.setIsAddingNew(true);
                                        }}
                                    >
                                        +
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

UserPage.propTypes = {
    currentUser: PropTypes.object,
    match: PropTypes.object.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    setIsAddingNew: PropTypes.func.isRequired,
};

export default UserPage;
