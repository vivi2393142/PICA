import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../img/banner';
import * as firebase from '../../firebase';
import { useHistory, Link } from 'react-router-dom';
import AddNew from './addNew';

// export default App;
const MainBanner = (props) => {
    const [showSignOut, setShowSignOut] = React.useState(false);

    let history = useHistory();
    let currentPage = history.location.pathname.slice(6, 9);
    let currentUserPage = history.location.pathname.slice(11);
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
                <bannerIcons.LogoW
                    onClick={() => history.push('./explore')}
                    className={styles.logo}
                />
                <div className={styles.leftNav}>
                    <div
                        onClick={() => history.push('../explore')}
                        className={`${
                            currentPage === 'exp' ||
                            currentPage === 'sho' ||
                            (currentPage === 'use' && props.currentUser.email !== currentUserPage)
                                ? styles.navChosen
                                : ''
                        } `}
                    >
                        探索畫布
                    </div>
                    <div
                        onClick={() => history.push(`./user/${props.currentUser.email}`)}
                        className={`${
                            currentPage === 'use' && props.currentUser.email === currentUserPage
                                ? styles.navChosen
                                : ''
                        } `}
                    >
                        我的畫布
                    </div>
                </div>
                <AddNew currentUser={props.currentUser} />
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
