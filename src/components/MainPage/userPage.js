import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../img/banner';
import * as firebase from '../../firebase';
import { nanoid } from 'nanoid';
import Loader from '../Loader';
import { doc } from 'prettier';
import ExploreItem from './exploreItem';

// export default App;
const UserPage = (props) => {
    const [isLoaded, setIsLoaded] = React.useState(true);
    const [isChoosingSize, setIsChoosingSize] = React.useState(false);
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

    React.useEffect(() => {
        firebase.loadUserData(props.match.params.userId, (dataFromFirebase) => {
            if (dataFromFirebase) {
                setUserDataFromFirebase(dataFromFirebase);
                setUserPhoto(dataFromFirebase.photo);
                setIsLoaded(false);
            }
        });
    }, []);
    React.useEffect(() => {
        firebase.getAllCanvasData((result) => {
            // console.log(userDataFromFirebase.canvas[0]);
            if (userDataFromFirebase.canvas[0] !== '') {
                let canvasDataWithImg = userDataFromFirebase.canvas.map((item) => {
                    const fileData = result.find((data) => data.basicSetting.id === item);
                    return {
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
    React.useEffect(() => {
        if (props.currentUser) {
            firebase.getLikeList(props.currentUser.email, (result) => {
                setLikeList(result);
            });
        }
    }, []);

    const likeHandler = () => console.log('ttt');

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
                      />
                  );
              });

    const canvasFilesJsx =
        canvasDataWithDataURL.length !== 0
            ? canvasDataWithDataURL.map((item, index) => {
                  return (
                      <div key={index} className={styles.fileWrapper}>
                          <div
                              className={styles.file}
                              onClick={() => (document.location.href = `../../file/${item.fileId}`)}
                          >
                              <img src={item.snapshot} className={styles.fileImg}></img>
                          </div>
                          <div className={styles.fileTitle}>{item.title}</div>
                      </div>
                  );
              })
            : null;

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
            {isLoaded ? <Loader></Loader> : null}
            <div className={styles.mainWrapper}>
                <div className={styles.main}>
                    <div className={styles.memberDetails}>
                        <div className={styles.memberPhotoWrapper}>
                            {isSmallLoaded ? (
                                <div className={styles.loaderWrapper}>
                                    <div className={styles.smallLoader}>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            ) : null}
                            <img src={userPhoto} className={styles.memberPhoto}></img>
                            {props.currentUser.email === props.match.params.userId ? (
                                <label>
                                    <input
                                        type='file'
                                        accept='image/png, image/jpeg'
                                        onChange={handleUploadImage}
                                    ></input>
                                </label>
                            ) : null}
                        </div>
                        <div className={styles.otherDetailsName}>{userDataFromFirebase.name}</div>
                        <div className={styles.otherDetails}>{userDataFromFirebase.email}</div>
                        <div className={styles.otherDetails}>
                            {userDataFromFirebase.canvas.length} files
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
                    <div className={styles.canvasFiles}>
                        {isAtMyCanvas ? null : likeListJsx}
                        {canvasFilesJsx && isAtMyCanvas ? canvasFilesJsx : null}
                        {props.currentUser.email === props.match.params.userId && isAtMyCanvas ? (
                            <div className={styles.fileWrapperNew}>
                                <div
                                    className={styles.addNew}
                                    onClick={() => {
                                        setIsChoosingSize(true);
                                    }}
                                >
                                    +
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
                {isChoosingSize ? (
                    <div className={styles.chooseNew}>
                        <div
                            className={styles.closeButton}
                            onClick={() => setIsChoosingSize(false)}
                        >
                            x
                        </div>
                        <div className={styles.chooseNewTitle}>選擇畫布尺寸</div>
                        {sizeSelectionJsx}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

UserPage.propTypes = {
    currentUser: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default UserPage;
