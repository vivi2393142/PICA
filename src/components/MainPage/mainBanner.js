import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../img/banner';
import * as firebase from '../../firebase';
import { useHistory, Link } from 'react-router-dom';

// export default App;
const MainBanner = (props) => {
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
                <bannerIcons.Logo
                    onClick={() => history.push('./explore')}
                    className={styles.logo}
                />
                <div className={styles.leftNav}>
                    <div
                        onClick={() => history.push('./explore')}
                        className={`${
                            currentPage === 'exp' || currentPage === 'sho' ? styles.navChosen : ''
                        } `}
                    >
                        探索作品
                    </div>
                    <div
                        onClick={() => history.push('./user')}
                        className={`${currentPage === 'use' ? styles.navChosen : ''} `}
                    >
                        我的作品
                    </div>
                </div>

                <div className={styles.button} onClick={signOutHandler}>
                    Sign Out
                </div>
            </div>
        </div>
    );
};

MainBanner.propTypes = {
    setCurrentUser: PropTypes.func.isRequired,
};

export default MainBanner;
