import React from 'react';
import '../../css/mainPage.scss';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../img/banner';
import * as backImg from '../../img/background';
import * as firebase from '../../firebase';

// export default App;
const MainPage = (props) => {
    React.useEffect(() => {
        firebase.checkCurrentUser(
            () => props.setIsUserLogin(true),
            () => props.setIsUserLogin(false)
        );
    }, []);

    // render
    return (
        <div className='mainPage'>
            <div className='bannerWrapper'>
                <div className='banner'>
                    <bannerIcons.Logo className='logo' />
                    <div
                        className='button'
                        onClick={() => firebase.nativeSignOut(() => props.setIsUserLogin(false))}
                    >
                        Sign Out
                    </div>
                </div>
            </div>
            <div className='mainWrapper'>
                <div className='main'>
                    <div className='addNewText'>建立新設計</div>
                    <div className='addNew'>+</div>
                </div>
                <div className='chooseNew'>
                    <div>選擇畫布尺寸</div>
                    <div></div>
                </div>
            </div>
        </div>
    );
};

MainPage.propTypes = {
    setIsUserLogin: PropTypes.func.isRequired,
};

export default MainPage;
