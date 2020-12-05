import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
// components
import Canvas from './components/Canvas/index';
import LandingPage from './components/LandingPage/index';
import MainPage from './components/MainPage/index';

// export default App;
export default function App() {
    const [currentUser, setCurrentUser] = React.useState(null);

    React.useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // console.log(user);
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });
    }, []);

    // render
    return (
        <Router>
            <div className='App'>
                <Switch>
                    <Route path='/file/:id' component={Canvas} />
                    <Route
                        path='/main'
                        component={() => (
                            <MainPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
                        )}
                    />
                    <Route path='/' exact>
                        {currentUser ? (
                            <Redirect to='/main' />
                        ) : (
                            <LandingPage
                                currentUser={currentUser}
                                setCurrentUser={setCurrentUser}
                            />
                        )}
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}
