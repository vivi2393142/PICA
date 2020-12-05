import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../img/banner';
import * as firebase from '../../firebase';
import { nanoid } from 'nanoid';
import Loader from '../Loader';

// export default App;
const MainPage = (props) => {
    const [isLoaded, setIsLoaded] = React.useState(true);
    const [isChoosingSize, setIsChoosingSize] = React.useState(false);
    const [userDataFromFirebase, setUserDataFromFirebase] = React.useState({});
    const canvasSizeOptions = [
        { name: '自訂尺寸->未完成(進畫布可以改)', width: 0, height: 0 },
        { name: 'Instagram 貼文', width: 1080, height: 1080 },
        { name: '網頁常用', width: 1280, height: 1024 },
        { name: '橫式海報', width: 1728, height: 1296, mmW: 609, mmH: 457 },
        { name: '明信片', width: 560, height: 288, mmW: 198, mmH: 102 },
        { name: '橫式A4', width: 842, height: 595, mmW: 297, mmH: 210 },
        // { name: 'Facebook 封面', width: 2050, height: 780 },
        { name: '名片', width: 1063, height: 638, mmW: 90, mmH: 54 },
    ];

    const handleCreateNew = (e) => {
        const selection = canvasSizeOptions.find((item) => item.name === e.currentTarget.id);
        const id = nanoid();
        const canvasSetting = {
            id: id,
            userEmail: props.currentUser.email,
            title: '',
            width: selection.width,
            height: selection.height,
        };
        firebase.createNewCanvas(canvasSetting, props.currentUser.email);
    };

    React.useEffect(() => {
        if (props.currentUser) {
            firebase.loadUserData(props.currentUser.email, (dataFromFirebase) => {
                setIsLoaded(false);
                setUserDataFromFirebase(dataFromFirebase);
            });
        }
    }, [props.currentUser]);

    const canvasFilesJsx = userDataFromFirebase.canvas
        ? userDataFromFirebase.canvas.map((item, index) => {
              return (
                  <div
                      className={styles.file}
                      key={index}
                      onClick={() => (document.location.href = `../file/${item}`)}
                  >
                      {item}
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
            <div className={styles.bannerWrapper}>
                <div className={styles.banner}>
                    <bannerIcons.Logo className={styles.logo} />
                    <div
                        className={styles.button}
                        onClick={() =>
                            firebase.nativeSignOut(() => {
                                props.setCurrentUser(null);
                                document.location.href = `./`;
                            })
                        }
                    >
                        Sign Out
                    </div>
                </div>
            </div>
            <div className={styles.mainWrapper}>
                <div className={styles.main}>
                    <div className={styles.memberDetails}>
                        <div className={styles.memberPhoto}></div>
                        <div>UserName</div>
                        {/* <div>{props.currentUser.email}</div> */}
                        <div> files</div>
                    </div>
                    <div className={styles.canvasFiles}>
                        {canvasFilesJsx ? canvasFilesJsx : null}
                        {/* {canvasFilesJsx} */}
                        {/* <div className={styles.'file'></div>
                        <div className={styles.'file'></div>
                        <div className={styles.'file'></div>
                        <div className={styles.'file'></div>
                        <div className={styles.'file'></div>
                        <div className={styles.'file'></div> */}
                        <div
                            className={`${styles.file} ${styles.addNew}`}
                            onClick={() => setIsChoosingSize(true)}
                        >
                            +
                        </div>
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

MainPage.propTypes = {
    setCurrentUser: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
};

export default MainPage;
