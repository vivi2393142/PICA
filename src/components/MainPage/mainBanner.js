import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../img/banner';
import * as firebase from '../../firebase';
import { useHistory, Link } from 'react-router-dom';
import testLogo from '../../img/src/banner/logo.png';
import AddNew from './addNew';

// export default App;
const MainBanner = (props) => {
    const [showSignOut, setShowSignOut] = React.useState(false);
    let history = useHistory();
    let currentPage = history.location.pathname.slice(6, 9);
    const signOutHandler = () => {
        firebase.nativeSignOut(() => {
            props.setCurrentUser({});
            history.push('../');
        });
    };

    // render
    return (
        <div className={styles.bannerWrapper}>
            <div className={styles.banner}>
                {/* <bannerIcons.Logo
                    onClick={() => history.push('./explore')}
                    className={styles.logo}
                /> */}
                <img src={testLogo} className={styles.logo}></img>
                <div className={styles.leftNav}>
                    <div
                        onClick={() => history.push('../explore')}
                        className={`${
                            currentPage === 'exp' || currentPage === 'sho' ? styles.navChosen : ''
                        } `}
                    >
                        探索畫布
                    </div>
                    <div
                        onClick={() => history.push(`./user/${props.currentUser.email}`)}
                        className={`${currentPage === 'use' ? styles.navChosen : ''} `}
                    >
                        我的畫布
                    </div>
                </div>
                <AddNew />
                <div className={styles.signWrapper}>
                    <bannerIcons.Down
                        className={styles.down}
                        onClick={() => setShowSignOut(!showSignOut)}
                    />
                </div>
                {showSignOut ? (
                    <div className={styles.signOut}>
                        <div className={styles.inner} onClick={signOutHandler}>
                            登出
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

MainBanner.propTypes = {
    setCurrentUser: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
};

export default MainBanner;
