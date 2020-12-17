import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as firebase from '../../firebase';
import { nanoid } from 'nanoid';
import Loader from '../Loader';
import ExploreItem from './exploreItem';
import * as mainIcons from '../../img/mainPage';
import { useHistory } from 'react-router-dom';

const TitleInput = (props) => {
    const [titleInput, setTitleInput] = React.useState(props.initialValue);
    const [isShowInput, setIsShowInput] = React.useState(false);
    const handleEdit = (e) => {
        setIsShowInput(true);
        e.currentTarget.firstChild.focus();
        const currentNode = e.currentTarget;
        const clickedOrNot = (e) => {
            if (!currentNode.contains(e.target)) {
                setIsShowInput(false);
                firebase.changeTitle(props.fileId, titleInput);
                document.removeEventListener('click', clickedOrNot, true);
            }
        };
        document.addEventListener('click', clickedOrNot, true);
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
        if (Object.keys(props.currentUser).length === 0) {
            alert('請先註冊或登入會員，以檢視我的畫布');
            history.push('/main/explore');
        }
    }, []);

    let history = useHistory();
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
            alert('請勿上傳超過2mb之圖片');
        } else {
            firebase.uploadUserPhoto(e, props.match.params.userId, (url) => {
                setUserPhoto(url);
                setIsSmallLoaded(false);
            });
        }
    };
    const deleteHandler = (e, fileId) => {
        e.stopPropagation();
        alert('一但刪除就無法復原囉，是否確定刪除？');
        firebase.deleteCanvas(props.currentUser.email, fileId);
        let newFilesData = canvasDataWithDataURL.filter((item) => item.fileId !== fileId);
        setCanvasDataWithDataURL(newFilesData);
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
            firebase.getLikeList(props.currentUser.email, (result) => {
                setLikeList(result);
            });
        }
    }, []);
    React.useEffect(() => {
        firebase.getAllCanvasData((result) => {
            if (userDataFromFirebase.canvas[0] !== '') {
                let canvasDataWithImg = userDataFromFirebase.canvas.map((item) => {
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
        e.stopPropagation();
        firebase.postLike(props.currentUser.email, item.fileId, item.isLike);
        let newData = likeList.filter((file) => file.fileId !== item.fileId);
        setLikeList(newData);
    };

    const likeListJsx =
        likeList.length === 0
            ? null
            : likeList.map((item, index) => {
                  return (
                      <ExploreItem
                          key={index}
                          item={item}
                          likeHandler={likeHandler}
                          className={styles.likeItem}
                          currentUser={props.currentUser}
                          parentNodeForClass={'user'}
                      />
                  );
              });

    const canvasFilesJsx =
        canvasDataWithDataURL.length !== 0 &&
        canvasDataWithDataURL.map((item, index) => {
            return (
                <div key={index} className={styles.fileWrapper}>
                    <div
                        className={styles.file}
                        onClick={() => {
                            props.currentUser.email === props.match.params.userId &&
                                history.push(`/file/${item.fileId}`);
                        }}
                        style={
                            props.currentUser.email !== props.match.params.userId
                                ? { cursor: 'default' }
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
                    {isAtMyCanvas ? null : (
                        <div className={styles.canvasLikesFiles}>{likeListJsx}</div>
                    )}
                    {canvasFilesJsx && isAtMyCanvas && (
                        <div className={styles.canvasFiles}>
                            {canvasFilesJsx}
                            {props.currentUser.email === props.match.params.userId && (
                                <div className={styles.fileWrapperNew}>
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
                    )}
                </div>
            </div>
        </div>
    );
};

UserPage.propTypes = {
    currentUser: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    setIsAddingNew: PropTypes.func.isRequired,
};

export default UserPage;
