import React from 'react';
import styles from '../../css/landingPage.module.scss';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../img/banner';
import * as backImg from '../../img/background';
import * as login from '../../img/landingPage.js';
import * as firebase from '../../firebase';

// export default App;
const LandingPage = (props) => {
    const [inputId, setInputId] = React.useState('');
    const [inputPwd, setInputPwd] = React.useState('');
    const [inputName, setInputName] = React.useState('');
    const [isLoginOrSignup, setIsLoginOrSignup] = React.useState(false);
    const [chooseLogin, setChooseLogin] = React.useState(true);
    const toggleClose = (e) => {
        setIsLoginOrSignup(false);
    };
    const toggleSign = () => {
        setChooseLogin(!chooseLogin);
    };

    // render
    return (
        <div className={styles.landingPage}>
            <div className={styles.bannerWrapper}>
                <div className={styles.banner}>
                    <bannerIcons.Logo className={styles.logo} />
                    <div
                        className={styles.button}
                        onClick={() => {
                            setIsLoginOrSignup(true);
                            setChooseLogin(true);
                        }}
                    >
                        Login
                    </div>
                    <div
                        className={`${styles.button} ${styles.signUp}`}
                        onClick={() => {
                            setIsLoginOrSignup(true);
                            setChooseLogin(false);
                        }}
                    >
                        Sign Up
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
                        <div
                            className={styles.startButton}
                            onClick={() => {
                                setIsLoginOrSignup(true);
                                setChooseLogin(true);
                            }}
                        >
                            GET STARTED
                        </div>
                    </div>
                    <div className={styles.mainImg}>
                        <backImg.BackY3 className={`${styles.imageY} ${styles.Y3}`} />
                        <backImg.BackY1 className={`${styles.imageY} ${styles.Y1}`} />
                        <backImg.BackG1 className={`${styles.imageG} ${styles.G1}`} />
                        <backImg.BackW1 className={`${styles.imageB} ${styles.B1}`} />
                        <backImg.BackW3 className={`${styles.imageB} ${styles.B3}`} />
                        <backImg.BackW4 className={`${styles.imageG} ${styles.G2}`} />
                    </div>
                </div>
            </div>

            {isLoginOrSignup ? (
                <div className={styles.loginCover} onClick={toggleClose}>
                    {/* {chooseLogin ? ( */}
                    <div className={styles.loginRect} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.textBox}>
                            <h1>還沒成為會員？</h1>
                            <h4>歡迎來到PICA，若您已經尚未加入會員，請點選下方按鈕進行註冊。</h4>
                            <div className={styles.button} onClick={toggleSign}>
                                SIGN UP
                            </div>
                        </div>
                        <div className={styles.textBox}>
                            <h1>已經擁有帳號了嗎？</h1>
                            <h4>歡迎來到PICA，若您已經擁有帳號，請點選下方按鈕進行登入。</h4>
                            <div className={styles.button} onClick={toggleSign}>
                                LOGIN
                            </div>
                        </div>
                    </div>
                    <div
                        className={`${styles.blockWrapper} ${
                            chooseLogin ? styles.blockWrapperRightAni : styles.blockWrapperLeftAni
                        } ${chooseLogin ? styles.blockWrapperRight : styles.blockWrapperLeft} `}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <div
                            className={`${styles.loginBlock} ${
                                chooseLogin ? styles.loginBlockLeft : styles.loginBlockRight
                            }`}
                        >
                            <div className={styles.inputTop}>會員登入</div>
                            <input
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                placeholder='Email'
                            ></input>
                            <input
                                type='password'
                                value={inputPwd}
                                onChange={(e) => setInputPwd(e.target.value)}
                                placeholder='密碼'
                            ></input>
                            <div
                                className={styles.submit}
                                onClick={() => {
                                    const user = firebase.nativeSignIn(inputId, inputPwd);
                                    user ? props.setCurrentUser(user) : props.setCurrentUser({});
                                }}
                            >
                                LOGIN
                            </div>
                            <div className={styles.otherSign}>
                                <div className={styles.or}></div>
                                <div
                                    className={styles.loginWayF}
                                    onClick={() => {
                                        const user = firebase.fbSignUp();
                                        user
                                            ? props.setCurrentUser(user)
                                            : props.setCurrentUser({});
                                    }}
                                >
                                    <login.Facebook className={styles.loginIcon} />
                                    <span>Facebook</span>
                                </div>
                                <div
                                    className={styles.loginWayG}
                                    onClick={() => {
                                        const user = firebase.googleSignUp();
                                        user
                                            ? props.setCurrentUser(user)
                                            : props.setCurrentUser({});
                                    }}
                                >
                                    <login.Google className={styles.loginIcon} />
                                    <span>Google</span>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`${styles.signupBlock} ${
                                chooseLogin ? styles.signupBlockLeft : styles.signupBlockRight
                            }`}
                        >
                            <div className={styles.inputTop}>註冊新帳號</div>
                            <input
                                value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                                placeholder='姓名'
                            ></input>
                            <input
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                placeholder='Email'
                            ></input>
                            <input
                                type='password'
                                value={inputPwd}
                                onChange={(e) => setInputPwd(e.target.value)}
                                placeholder='密碼(6位以上)'
                            ></input>
                            <div
                                className={styles.submit}
                                onClick={() => {
                                    const user = firebase.nativeSignUp(
                                        inputName,
                                        inputId,
                                        inputPwd
                                    );
                                    console.log(user);
                                    user ? props.setCurrentUser(user) : props.setCurrentUser({});
                                }}
                            >
                                SIGN UP
                            </div>
                            <div className={styles.otherSign}>
                                <div className={styles.or}></div>
                                <div
                                    className={styles.loginWayF}
                                    onClick={() => {
                                        const user = firebase.fbSignUp();
                                        user
                                            ? props.setCurrentUser(user)
                                            : props.setCurrentUser({});
                                    }}
                                >
                                    <login.Facebook className={styles.loginIcon} />
                                    <span>Facebook</span>
                                </div>
                                <div
                                    className={styles.loginWayG}
                                    onClick={() => {
                                        const user = firebase.googleSignUp();
                                        user
                                            ? props.setCurrentUser(user)
                                            : props.setCurrentUser({});
                                    }}
                                >
                                    <login.Google className={styles.loginIcon} />
                                    <span>Google</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

LandingPage.propTypes = {
    setCurrentUser: PropTypes.func.isRequired,
};

export default LandingPage;
