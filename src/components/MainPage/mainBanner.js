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
    const signOutHandler = () => {
        firebase.nativeSignOut(() => {
            props.setCurrentUser({});
            history.push('/');
        });
    };

    // render
    return (
        <div className={styles.bannerWrapper}>
            <div className={styles.banner}>
                <bannerIcons.LogoW
                    onClick={() => history.push('/main/explore')}
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
                        onClick={() => history.push(`/main/user/${props.currentUser.email}`)}
                        className={`${props.currentPage !== 'explore' ? styles.navChosen : ''} `}
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
    currentPage: PropTypes.string.isRequired,
};

export default MainBanner;
