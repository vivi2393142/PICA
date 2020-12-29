import React from 'react';
import styles from '../../css/landingPage.module.scss';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../img/banner';
import * as login from '../../img/landingPage.js';
import Login from '../Login';
import { useHistory } from 'react-router-dom';

// export default App;
const LandingPage = (props) => {
    const history = useHistory();
    const [isLoginOrSignup, setIsLoginOrSignup] = React.useState(false);
    const [chooseLogin, setChooseLogin] = React.useState(true);

    React.useEffect(() => {
        if (props.currentUser.email && props.currentUser.email !== 'noUser') {
            history.push('/main/explore');
        }
    }, [props.currentUser]);

    // render
    return (
        <div className={styles.landingPage}>
            <div className={styles.bannerWrapper}>
                <div className={styles.banner}>
                    <bannerIcons.LogoW className={styles.logo} />
                    <div
                        className={styles.button}
                        onClick={() => {
                            setIsLoginOrSignup(true);
                            setChooseLogin(true);
                        }}
                    >
                        登入
                    </div>
                    <div
                        className={`${styles.button} ${styles.signUp}`}
                        onClick={() => {
                            setIsLoginOrSignup(true);
                            setChooseLogin(false);
                        }}
                    >
                        註冊
                    </div>
                </div>
            </div>
            <div className={styles.mainWrapper}>
                <div className={styles.main}>
                    <div className={styles.mainText}>
                        <h1>
                            Be an artist through <br />
                            <span>PIC</span>tures <span>A</span>rt{' '}
                        </h1>
                        <p>一分鐘內輕易上手，設計可以比你想的還容易。</p>
                        <div className={styles.startButtonWrapper}>
                            <div
                                className={styles.startButton}
                                onClick={() => {
                                    setIsLoginOrSignup(true);
                                    setChooseLogin(false);
                                }}
                            >
                                加入會員
                            </div>
                            <div
                                className={styles.startButton}
                                onClick={() => {
                                    history.push('/main/explore');
                                }}
                            >
                                免註冊試用
                            </div>
                        </div>
                    </div>
                    <login.LandingMain className={styles.mainImg} />
                </div>
            </div>
            {isLoginOrSignup && (
                <Login
                    isLoginOrSignup={isLoginOrSignup}
                    setIsLoginOrSignup={setIsLoginOrSignup}
                    setChooseLogin={setChooseLogin}
                    chooseLogin={chooseLogin}
                    setCurrentUser={props.setCurrentUser}
                />
            )}
        </div>
    );
};

LandingPage.propTypes = {
    setCurrentUser: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
};

export default LandingPage;
