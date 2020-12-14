import React from 'react';
import PropTypes from 'prop-types';
import MainBanner from './mainBanner';
import UserPage from './userPage';
import Explore from './explore';
import Shots from './shots';
// import AddNew from './addNew';
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
                    component={() => <Explore currentUser={props.currentUser} />}
                />
                <Route
                    path='/main/user/:userId'
                    exact
                    component={(ownProps) => (
                        <UserPage currentUser={props.currentUser} {...ownProps} />
                    )}
                />
                <Route
                    path='/main/shots/:fileId'
                    component={(ownProps) => (
                        <Shots currentUser={props.currentUser} {...ownProps} />
                    )}
                />
                <Redirect from='/main' to='/main/explore' />
            </Switch>
        </div>
    );
};

MainPage.propTypes = { setCurrentUser: PropTypes.func.isRequired, currentUser: PropTypes.object };

export default MainPage;
