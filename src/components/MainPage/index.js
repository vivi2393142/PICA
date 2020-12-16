import React from 'react';
import PropTypes from 'prop-types';
import MainBanner from './mainBanner';
import UserPage from './userPage';
import Explore from './explore';
import Shots from './shots';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

// export default App;
const MainPage = (props) => {
    const [currentPage, setCurrentPage] = React.useState('explore');
    const [isAddingNew, setIsAddingNew] = React.useState(false);

    // render
    return (
        <div>
            <MainBanner
                currentUser={props.currentUser}
                setCurrentUser={props.setCurrentUser}
                currentPage={currentPage}
                setIsAddingNew={setIsAddingNew}
                isAddingNew={isAddingNew}
            />
            <Switch>
                <Route
                    path='/main/explore'
                    component={() => (
                        <Explore currentUser={props.currentUser} setCurrentPage={setCurrentPage} />
                    )}
                />
                <Route
                    path='/main/user/:userId'
                    exact
                    component={(ownProps) => (
                        <UserPage
                            currentUser={props.currentUser}
                            {...ownProps}
                            setCurrentPage={setCurrentPage}
                            setIsAddingNew={setIsAddingNew}
                        />
                    )}
                />
                <Route
                    path='/main/shots/:fileId'
                    component={(ownProps) => (
                        <Shots
                            currentUser={props.currentUser}
                            {...ownProps}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                />
                <Redirect from='/main' to='/main/explore' />
            </Switch>
        </div>
    );
};

MainPage.propTypes = { setCurrentUser: PropTypes.func.isRequired, currentUser: PropTypes.object };

export default MainPage;
