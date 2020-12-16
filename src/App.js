import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
// components
import Canvas from './components/Canvas/index';
import LandingPage from './components/LandingPage/index';
import MainPage from './components/MainPage/index';
import { useHistory } from 'react-router-dom';

// export default App;
export default function App() {
    const [currentUser, setCurrentUser] = React.useState({});
    const [currentUserTimes, setCurrentUserTimes] = React.useState(0);
    // trackCurrentUser
    if (currentUserTimes === 0) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user && user !== currentUser) {
                setCurrentUser(user);
            }
            // else if (document.location.pathname !== '/' && user === null) {
            //     document.location.href = '/';
            // }
        });
        setCurrentUserTimes(1);
    }

    // render
    return (
        <Router>
            <div className='App'>
                <Route path='/main'>
                    {/* {Object.keys(currentUser).length !== 0 ? ( */}
                    <MainPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
                    {/* ) : (
                        <Redirect to='/' />
                    )} */}
                </Route>
                <Switch>
                    <Route
                        path='/file/:id'
                        render={(props) => <Canvas currentUser={currentUser} {...props} />}
                    />

                    <Route path='/' exact>
                        {Object.keys(currentUser).length === 0 ? (
                            <LandingPage
                                currentUser={currentUser}
                                setCurrentUser={setCurrentUser}
                            />
                        ) : (
                            <Redirect to='/main' />
                        )}
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
