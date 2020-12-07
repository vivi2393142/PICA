import React from 'react';
import styles from '../../css/landingPage.module.scss';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../img/banner';
import * as backImg from '../../img/background';
import * as firebase from '../../firebase';

// export default App;
const LandingPage = (props) => {
    const [inputId, setInputId] = React.useState('');
    const [inputPwd, setInputPwd] = React.useState('');
    const [isLoginOrSignup, setIsLoginOrSignup] = React.useState(false);
    const [chooseLogin, setChooseLogin] = React.useState(true);

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
                        <h1>Be an artist through PICtures Art </h1>
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
                <div className={styles.loginCover}>
                    {chooseLogin ? (
                        <div className={styles.loginBlock}>
                            <div className={styles.close} onClick={() => setIsLoginOrSignup(false)}>
                                x
                            </div>
                            <div className={styles.inputTop}>登入</div>
                            <div className={styles.inputName}>Email帳號</div>
                            <input
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                placeholder='請輸入email'
                            ></input>
                            <div className={styles.inputName}>密碼</div>
                            <input
                                type='password'
                                value={inputPwd}
                                onChange={(e) => setInputPwd(e.target.value)}
                                placeholder='請輸入密碼'
                            ></input>
                            <div
                                className={styles.submit}
                                onClick={() => {
                                    const user = firebase.nativeSignIn(inputId, inputPwd);
                                    user ? props.setCurrentUser(user) : props.setCurrentUser({});
                                }}
                            >
                                確認
                            </div>
                            <div className={styles.toggle} onClick={() => setChooseLogin(false)}>
                                註冊帳號
                            </div>
                        </div>
                    ) : (
                        <div className={styles.signupBlock}>
                            <div className={styles.close} onClick={() => setIsLoginOrSignup(false)}>
                                x
                            </div>
                            <div className={styles.inputTop}>註冊新帳號</div>
                            <div className={styles.inputName}>Email帳號</div>
                            <input
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                placeholder='請輸入有效email地址'
                            ></input>
                            <div className={styles.inputName}>密碼</div>
                            <input
                                type='password'
                                value={inputPwd}
                                onChange={(e) => setInputPwd(e.target.value)}
                                placeholder='請輸入6位以上密碼'
                            ></input>
                            <div
                                className={styles.submit}
                                onClick={() => {
                                    const user = firebase.nativeSignUp(inputId, inputPwd);
                                    user ? props.setCurrentUser(user) : props.setCurrentUser({});
                                }}
                            >
                                確認
                            </div>
                            <div className={styles.toggle} onClick={() => setChooseLogin(true)}>
                                會員登入
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

LandingPage.propTypes = {
    setCurrentUser: PropTypes.func.isRequired,
};

export default LandingPage;
