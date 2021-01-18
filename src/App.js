import { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Canvas from './components/Canvas/index';
import LandingPage from './components/LandingPage/index';
import MainPage from './components/MainPage/index';

export default function App() {
    const [currentUser, setCurrentUser] = useState({ email: null });
    const [currentUserTimes, setCurrentUserTimes] = useState(0);
    if (currentUserTimes === 0) {
        firebase.auth().onAuthStateChanged((user) => {
            user ? setCurrentUser(user) : setCurrentUser({ email: 'noUser' });
        });
        setCurrentUserTimes(1);
    }

    return (
        <Router>
            <div className='App'>
                <Switch>
                    <Route path='/main'>
                        <MainPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
                    </Route>
                    <Route
                        path='/file/:id'
                        render={(props) => <Canvas currentUser={currentUser} {...props} />}
                    />
                    <Route path='/' exact>
                        <LandingPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
                    </Route>
                    <Route path='*'>
                        <Redirect to='/' />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
