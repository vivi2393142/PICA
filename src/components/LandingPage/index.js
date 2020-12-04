import React from 'react';
import '../../css/landingPage.scss';
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

    React.useEffect(() => {
        firebase.checkCurrentUser(
            () => props.setIsUserLogin(true),
            () => props.setIsUserLogin(false)
        );
    }, []);

    // render
    return (
        <div className='landingPage'>
            <div className='bannerWrapper'>
                <div className='banner'>
                    <bannerIcons.Logo className='logo' />
                    <div
                        className='button'
                        onClick={() => {
                            setIsLoginOrSignup(true);
                            setChooseLogin(true);
                        }}
                    >
                        Login
                    </div>
                    <div
                        className='button signUp'
                        onClick={() => {
                            setIsLoginOrSignup(true);
                            setChooseLogin(false);
                        }}
                    >
                        Sign Up
                    </div>
                </div>
            </div>
            <div className='mainWrapper'>
                <div className='main'>
                    <div className='mainText'>
                        <h1>Be an artist through PICtures Art </h1>
                        <p>1分鐘內輕易上手，設計可以比你想的還容易。</p>
                        <div className='startButton'>GET STARTED</div>
                    </div>
                    <div className='mainImg'>
                        <backImg.BackY3 className='imageY Y3' />
                        <backImg.BackY1 className='imageY Y1' />
                        <backImg.BackG1 className='imageG G1' />
                        <backImg.BackW1 className='imageB B1' />
                        <backImg.BackW3 className='imageB B3' />
                        <backImg.BackW4 className='imageG G2' />
                    </div>
                </div>
            </div>

            {isLoginOrSignup ? (
                <div className='loginCover'>
                    {chooseLogin ? (
                        <div className='loginBlock'>
                            <div className='close' onClick={() => setIsLoginOrSignup(false)}>
                                x
                            </div>
                            <div className='inputTop'>登入</div>
                            <div className='inputName'>Email帳號</div>
                            <input
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                placeholder='請輸入email'
                            ></input>
                            <div className='inputName'>密碼</div>
                            <input
                                type='password'
                                value={inputPwd}
                                onChange={(e) => setInputPwd(e.target.value)}
                                placeholder='請輸入密碼'
                            ></input>
                            <div
                                className='submit'
                                onClick={() =>
                                    firebase.nativeSignIn(inputId, inputPwd, () =>
                                        props.setIsUserLogin(true)
                                    )
                                }
                            >
                                確認
                            </div>
                            <div className='toggle' onClick={() => setChooseLogin(false)}>
                                註冊帳號
                            </div>
                        </div>
                    ) : (
                        <div className='signupBlock'>
                            <div className='close' onClick={() => setIsLoginOrSignup(false)}>
                                x
                            </div>
                            <div className='inputTop'>註冊新帳號</div>
                            <div className='inputName'>Email帳號</div>
                            <input
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                placeholder='請輸入有效email地址'
                            ></input>
                            <div className='inputName'>密碼</div>
                            <input
                                type='password'
                                value={inputPwd}
                                onChange={(e) => setInputPwd(e.target.value)}
                                placeholder='請輸入6位以上密碼'
                            ></input>
                            <div
                                className='submit'
                                onClick={() =>
                                    firebase.nativeSignUp(inputId, inputPwd, () =>
                                        props.setIsUserLogin(true)
                                    )
                                }
                            >
                                確認
                            </div>
                            <div className='toggle' onClick={() => setChooseLogin(true)}>
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
    setIsUserLogin: PropTypes.func.isRequired,
};

export default LandingPage;
