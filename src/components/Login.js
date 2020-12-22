import React from 'react';
import styles from '../css/landingPage.module.scss';
import PropTypes from 'prop-types';
import * as login from '../img/landingPage.js';
import * as firebase from '../firebase';
import { useHistory } from 'react-router-dom';
import Alert from './Alert';

// export default App;
const Login = (props) => {
    let history = useHistory();
    const [inputId, setInputId] = React.useState('');
    const [inputPwd, setInputPwd] = React.useState('');
    const [inputName, setInputName] = React.useState('');
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
    const toggleClose = (e) => {
        props.setIsLoginOrSignup(false);
    };
    const toggleSign = () => {
        props.setChooseLogin(!props.chooseLogin);
    };

    return (
        <div className={styles.loginCover} onClick={toggleClose}>
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
            <div
                className={`${styles.loginRect} ${
                    props.chooseLogin ? styles.rectGreen : styles.rectYellow
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.textBox}>
                    <h1>還沒成為會員？</h1>
                    <h4>歡迎來到PICA，若您尚未加入會員，請點選下方按鈕進行註冊。</h4>
                    <div className={styles.button} onClick={toggleSign}>
                        切換至註冊
                    </div>
                    <div className={styles.try} onClick={() => history.push('/main/explore')}>
                        或點此以非會員身份試用體驗
                    </div>
                </div>
                <div className={styles.textBox}>
                    <h1>已經擁有帳號了嗎？</h1>
                    <h4>歡迎來到PICA，若您已經擁有帳號，請點選下方按鈕進行登入。</h4>
                    <div className={styles.button} onClick={toggleSign}>
                        切換至登入
                    </div>
                    <div className={styles.try} onClick={() => history.push('/main/explore')}>
                        或點此以非會員身份試用體驗
                    </div>
                </div>
            </div>
            <div
                className={`${styles.blockWrapper} ${
                    props.chooseLogin ? styles.blockWrapperRightAni : styles.blockWrapperLeftAni
                } ${props.chooseLogin ? styles.blockWrapperRight : styles.blockWrapperLeft} `}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div
                    className={`${styles.loginBlock} ${
                        props.chooseLogin ? styles.loginBlockLeft : styles.loginBlockRight
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
                            setAlertSetting({
                                buttonNumber: 1,
                                buttonOneFunction: () => setShowAlert(false),
                                buttonTwoFunction: () => {},
                                buttonOneTitle: '關閉',
                                buttonTwoTitle: '',
                                title: '註冊錯誤',
                                content: '請輸入正確帳號密碼',
                            });
                            const user = firebase.nativeSignIn(inputId, inputPwd, () => {
                                setShowAlert(true);
                            });
                            user
                                ? props.setCurrentUser(user)
                                : props.setCurrentUser({ email: 'noUser' });
                        }}
                    >
                        登入
                    </div>
                    <div className={styles.otherSign}>
                        <div className={styles.or}></div>
                        <div
                            className={styles.loginWayF}
                            onClick={() => {
                                const user = firebase.fbSignUp();
                                user
                                    ? props.setCurrentUser(user)
                                    : props.setCurrentUser({ email: 'noUser' });
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
                                    : props.setCurrentUser({ email: 'noUser' });
                            }}
                        >
                            <login.Google className={styles.loginIcon} />
                            <span>Google</span>
                        </div>
                    </div>
                </div>
                <div
                    className={`${styles.signupBlock} ${
                        props.chooseLogin ? styles.signupBlockLeft : styles.signupBlockRight
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
                            setAlertSetting({
                                buttonNumber: 1,
                                buttonOneFunction: () => setShowAlert(false),
                                buttonTwoFunction: () => {},
                                buttonOneTitle: '關閉',
                                buttonTwoTitle: '',
                                title: '註冊錯誤',
                                content: '請輸入有效之email地址及6位以上密碼',
                            });
                            firebase.nativeSignUp(
                                inputName.toLowerCase(),
                                inputId,
                                inputPwd,
                                () => {
                                    setShowAlert(true);
                                }
                            );
                        }}
                    >
                        註冊
                    </div>
                    <div className={styles.otherSign}>
                        <div className={styles.or}></div>
                        <div
                            className={styles.loginWayF}
                            onClick={() => {
                                firebase.fbSignUp();
                            }}
                        >
                            <login.Facebook className={styles.loginIcon} />
                            <span>Facebook</span>
                        </div>
                        <div
                            className={styles.loginWayG}
                            onClick={() => {
                                firebase.googleSignUp();
                            }}
                        >
                            <login.Google className={styles.loginIcon} />
                            <span>Google</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Login.propTypes = {
    setCurrentUser: PropTypes.func.isRequired,
    chooseLogin: PropTypes.bool.isRequired,
    setChooseLogin: PropTypes.func.isRequired,
    isLoginOrSignup: PropTypes.bool.isRequired,
    setIsLoginOrSignup: PropTypes.func.isRequired,
};

export default Login;
