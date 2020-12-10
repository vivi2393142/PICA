import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as firebase from '../../firebase';
import { nanoid } from 'nanoid';
import Loader from '../Loader';
import MainBanner from './mainBanner';
import UserPage from './userPage';
import Explore from './explore';
import Shots from './shots';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

// export default App;
const MainPage = (props) => {
    // render
    return (
        <div>
            <MainBanner currentUser={props.currentUser} setCurrentUser={props.setCurrentUser} />
            <Switch>
                <Route
                    path='/main/explore'
                    component={() => (
                        <Explore
                        // currentUser={props.currentUser}
                        // setCurrentUser={props.setCurrentUser}
                        />
                    )}
                />
                <Route
                    path='/main/user'
                    exact
                    component={() => (
                        <UserPage
                            currentUser={props.currentUser}
                            setCurrentUser={props.setCurrentUser}
                        />
                    )}
                />
                <Route path='/main/shots/:fileId' component={Shots} />
                <Redirect from='/main' to='/main/explore' />
            </Switch>
        </div>
    );
};

MainPage.propTypes = { setCurrentUser: PropTypes.func.isRequired, currentUser: PropTypes.object };

export default MainPage;
