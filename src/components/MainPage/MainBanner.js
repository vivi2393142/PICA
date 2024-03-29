import { useState, memo } from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../img/banner';
import * as firebase from '../../utils/firebase.js';
import { useHistory } from 'react-router-dom';
import AddNew from './AddNew';
import Login from '../Login';
import Loader from '../Loader';

const MainBanner = (props) => {
    const history = useHistory();
    const [showSignOut, setShowSignOut] = useState(false);
    const [isLoginOrSignup, setIsLoginOrSignup] = useState(false);
    const [chooseLogin, setChooseLogin] = useState(true);
    const [photoSrc, setPhotoSrc] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const signOutHandler = async () => {
        await setIsLoaded(true);
        firebase.nativeSignOut(() => {
            history.go(0);
        });
    };
    const toggleMember = (e) => {
        e.stopPropagation();
        setShowSignOut(true);
        const closeMemberSelect = () => {
            setShowSignOut(false);
            document.removeEventListener('click', closeMemberSelect);
        };
        document.addEventListener('click', closeMemberSelect);
    };
    const getUserPhoto = () => {
        if (props.currentUser.email && props.currentUser.email !== 'noUser') {
            firebase.getUserPhoto(props.currentUser.email, (photoURL) => {
                setPhotoSrc(photoURL);
            });
        }
    };
    getUserPhoto();

    return (
        <div className={styles.bannerWrapper}>
            {isLoaded && <Loader></Loader>}
            <div className={styles.banner}>
                <bannerIcons.LogoW
                    onClick={() => {
                        props.currentUser.email === 'noUser'
                            ? history.push('/')
                            : history.push('/main/explore');
                    }}
                    className={styles.logo}
                />
                <div className={styles.leftNav}>
                    <div
                        onClick={() => history.push('/main/explore')}
                        className={`${props.currentPage === 'explore' ? styles.navChosen : ''} `}
                    >
                        探索畫布
                    </div>
                    <div
                        onClick={() => {
                            if (history.location.pathname.slice(0, 10) === '/main/user') {
                                history.push(`/main/user/${props.currentUser.email}`);
                                history.go(0);
                            } else {
                                history.push(`/main/user/${props.currentUser.email}`);
                            }
                        }}
                        className={`${props.currentPage !== 'explore' ? styles.navChosen : ''} `}
                    >
                        我的畫布
                    </div>
                </div>
                <AddNew
                    currentUser={props.currentUser}
                    setIsAddingNew={props.setIsAddingNew}
                    isAddingNew={props.isAddingNew}
                    isAtMobile={props.isAtMobile}
                />
                <div className={`${photoSrc ? styles.memberWrapper : styles.defaultWrapper}`}>
                    {photoSrc ? (
                        <img className={styles.memberPhoto} src={photoSrc} onClick={toggleMember} />
                    ) : (
                        <div className={styles.defaultPhoto} onClick={toggleMember}>
                            註冊 / 登入
                        </div>
                    )}
                </div>
                {showSignOut && (
                    <div className={styles.signOut} onClick={(e) => e.stopPropagation()}>
                        {props.currentUser.email === 'noUser' && (
                            <div
                                className={styles.inner}
                                onClick={() => {
                                    setIsLoginOrSignup(true);
                                    setChooseLogin(true);
                                    setShowSignOut(false);
                                }}
                            >
                                會員登入
                            </div>
                        )}
                        {props.currentUser.email === 'noUser' && (
                            <div
                                className={styles.inner}
                                onClick={() => {
                                    setIsLoginOrSignup(true);
                                    setChooseLogin(false);
                                    setShowSignOut(false);
                                }}
                            >
                                會員註冊
                            </div>
                        )}
                        {props.currentUser.email && props.currentUser.email !== 'noUser' && (
                            <div className={styles.inner} onClick={signOutHandler}>
                                登出
                            </div>
                        )}
                    </div>
                )}
                {props.currentUser.email === 'noUser' && isLoginOrSignup && (
                    <Login
                        isLoginOrSignup={isLoginOrSignup}
                        setIsLoginOrSignup={setIsLoginOrSignup}
                        setChooseLogin={setChooseLogin}
                        chooseLogin={chooseLogin}
                        setCurrentUser={props.setCurrentUser}
                    />
                )}
            </div>
        </div>
    );
};

MainBanner.propTypes = {
    setCurrentUser: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    currentPage: PropTypes.string.isRequired,
    isAddingNew: PropTypes.bool.isRequired,
    setIsAddingNew: PropTypes.func.isRequired,
    isAtMobile: PropTypes.string.isRequired,
};

export default memo(MainBanner);
