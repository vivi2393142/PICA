import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as firebase from '../../utils/firebase.js';
import { nanoid } from 'nanoid';
import Loader from '../Loader';
import ExploreItem from './exploreItem';
import * as mainIcons from '../../img/mainPage';
import { useHistory } from 'react-router-dom';
import Alert from '../Alert';
import { trackOutSideClick } from '../../utils/utils.js';

const TitleInput = (props) => {
    const [titleInput, setTitleInput] = React.useState(props.initialValue);
    const [isShowInput, setIsShowInput] = React.useState(false);
    const handleEdit = (e) => {
        setIsShowInput(true);
        e.currentTarget.firstChild.focus();
        const currentNode = e.currentTarget;
        trackOutSideClick(currentNode, () => {
            setIsShowInput(false);
            firebase.changeTitle(props.fileId, currentNode.firstElementChild.value);
        });
    };
    return (
        <div className={styles.titleWrapper} onClick={(e) => handleEdit(e)}>
            <input
                value={titleInput}
                onChange={(e) => {
                    setTitleInput(e.target.value);
                }}
                style={{
                    opacity: isShowInput ? 1 : 0,
                    zIndex: isShowInput ? 1 : -1,
                }}
            ></input>
            <div
                className={styles.fileTitle}
                style={{
                    opacity: isShowInput ? 0 : 1,
                }}
            >
                {titleInput}
            </div>
        </div>
    );
};

TitleInput.propTypes = {
    initialValue: PropTypes.string.isRequired,
    fileId: PropTypes.string.isRequired,
};

const UserPage = (props) => {
    const [isLoaded, setIsLoaded] = React.useState(true);
    const [isSmallLoaded, setIsSmallLoaded] = React.useState(false);
    const [isAtMyCanvas, setIsAtMyCanvas] = React.useState(true);
    const [likeList, setLikeList] = React.useState([]);
    const [userDataFromFirebase, setUserDataFromFirebase] = React.useState({ canvas: [] });
    const [canvasDataWithDataURL, setCanvasDataWithDataURL] = React.useState([]);
    const [userPhoto, setUserPhoto] = React.useState('');
    const [isLikeLoader, setIsLikeLoader] = React.useState(true);
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertSetting, setAlertSetting] = React.useState({
        buttonNumber: 0,
        buttonOneFunction: () => {},
        buttonTwoFunction: () => {},
        buttonOneTitle: '',
        buttonTwoTitle: '',
        title: '',
        content: '',
    });
    const canvasSizeOptions = [
        { name: 'Instagram 貼文', type: 'instagram', width: 1080, height: 1080 },
        { name: '橫式海報', type: 'poster', width: 1728, height: 1296, mmW: 609, mmH: 457 },
        { name: '明信片', type: 'postCard', width: 560, height: 288, mmW: 198, mmH: 102 },
        { name: '網頁常用', type: 'web', width: 1280, height: 1024 },
        { name: '橫式A4', type: 'a4', width: 842, height: 595, mmW: 297, mmH: 210 },
        { name: '名片', type: 'nameCard', width: 1063, height: 638, mmW: 90, mmH: 54 },
        { name: '自訂尺寸->未完成(進畫布可以改)', type: 'custom', width: 0, height: 0 },
    ];

    React.useEffect(() => {
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
    }, [props.currentUser]);

    const history = useHistory();
    const handleCreateNew = (e) => {
        const selection = canvasSizeOptions.find((item) => item.name === e.currentTarget.id);
        const id = nanoid();
        const canvasSetting = {
            id: id,
            userEmail: props.match.params.userId,
            title: '',
            width: selection.width,
            height: selection.height,
            type: selection.type,
        };
        firebase.createNewCanvas(canvasSetting, props.match.params.userId);
    };
    const handleUploadImage = (e) => {
        setIsSmallLoaded(true);
        if (e.target.files[0].size > 2097152) {
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
        setAlertSetting({
            buttonNumber: 2,
            buttonOneFunction: () => {
                setShowAlert(false);
                firebase.deleteCanvas(props.currentUser.email, fileId);
                const newFilesData = canvasDataWithDataURL.filter((item) => item.fileId !== fileId);
                setCanvasDataWithDataURL(newFilesData);
            },
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

    React.useEffect(() => {
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
        firebase.getAllCanvasData((result) => {
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
                setCanvasDataWithDataURL(canvasDataWithImg);
            }
        });
    }, [userDataFromFirebase.canvas]);

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
    const sizeSelectionJsx = canvasSizeOptions.map((item, index) => {
        if (item.name !== '自訂尺寸') {
            return (
                <div
                    key={index}
                    id={item.name}
                    className={styles.sizeOption}
                    onClick={(e) => handleCreateNew(e)}
                >
                    {item.name}
                    <div className={styles.sizeDetails}>
                        {item.mmW
                            ? `${item.mmW}×${item.mmH} mm`
                            : `${item.width}×${item.height} px`}
                    </div>
                </div>
            );
        } else {
            return (
                <div
                    key={index}
                    id={item.name}
                    className={styles.sizeOption}
                    // onClick={handleCreateNew}
                >
                    {item.name}
                </div>
            );
        }
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
