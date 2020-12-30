import React from 'react';
import PropTypes from 'prop-types';
import MainBanner from './MainBanner';
import UserPage from './UserPage';
import Explore from './Explore';
import Shots from './Shots';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { mediaQuerySize } from '../../utils/globalConfig.js';

const MainPage = (props) => {
    const [currentPage, setCurrentPage] = React.useState('explore');
    const [isAddingNew, setIsAddingNew] = React.useState(false);
    const [isAtMobile, setIsAtMobile] = React.useState('normal');
    React.useEffect(() => {
        const setSizeState = () => {
            window.innerWidth <= mediaQuerySize.big && window.innerWidth > mediaQuerySize.big
                ? setIsAtMobile('small')
                : window.innerWidth <= mediaQuerySize.small
                ? setIsAtMobile('superSmall')
                : setIsAtMobile('normal');
        };
        setSizeState();
        window.addEventListener('resize', setSizeState);
    }, []);

    // render
    return (
        <div>
            <MainBanner
                currentUser={props.currentUser}
                setCurrentUser={props.setCurrentUser}
                currentPage={currentPage}
                setIsAddingNew={setIsAddingNew}
                isAddingNew={isAddingNew}
                isAtMobile={isAtMobile}
            />
            <Switch>
                <Route path='/main/explore'>
                    <Explore currentUser={props.currentUser} setCurrentPage={setCurrentPage} />
                </Route>
                <Route
                    path='/main/user/:userId'
                    exact
                    render={(ownProps) => (
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
                    render={(ownProps) => (
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

export default React.memo(MainPage);
