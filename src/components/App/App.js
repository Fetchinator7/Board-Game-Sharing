import React, { Component } from 'react';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux';

import Nav from './Nav/Nav';
import Footer from './Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import AboutPage from '../Pages/AboutPage/AboutPage';
import UserPage from '../Pages/UserPage/UserPage';
import InfoPage from '../Pages/InfoPage/InfoPage';
import SearchPage from '../Pages/SearchPageGames/SearchPageGames';
import UsersSearchPage from '../Pages/SearchPageUsers/SearchPageUsers';
import UsersSettingsPage from '../Pages/UserPage/UserPageSettings';
import DatePicker from '../Components/DatePicker/DatePicker';

import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_USER' });
  }

  render() {
    return (
      <Router>
        <>
          <Nav />
          <Switch>
            <Redirect exact path='/' to='/home' />
            {/* Visiting localhost:3000/about will show the about page.
            This is a route anyone can see, no login necessary */}
            <Route
              exact
              path='/about'
              component={AboutPage}
            />
            <Route
              exact
              path='/search/games'
              component={SearchPage}
            />
            <Route
              exact
              path='/search/users'
              component={UsersSearchPage}
            />
            <Route exact path='/calendar'>
              <DatePicker mode='request' />
            </Route>
            <Route
              exact
              path='/test-user'
              component={UserPage}
            />
            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home */}
            <ProtectedRoute
              exact
              path='/home'
              component={UserPage}
            />
            <ProtectedRoute
              // exact
              path='/settings'
              component={UsersSettingsPage}
            />
            {/* This works the same as the other protected route, except that if the user is logged in,
            they will see the info page instead. */}
            <ProtectedRoute
              exact
              path='/info'
              component={InfoPage}
            />
            {/* If none of the other routes matched, we will show a 404. */}
            <Route render={() => <h1>404</h1>} />
          </Switch>
          {/* <Footer /> */}
        </>
      </Router>
    );
  }
}

export default connect()(App);
