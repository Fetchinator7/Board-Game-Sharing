import React, { Component } from 'react';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Nav from './Nav/Nav';
import Footer from './Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import UserPage from '../Pages/UserPage/UserPage';
import HomePage from '../Pages/HomePage/HomePage';
import LoggedOutUser from '../Pages/LoggedOutUserProfilePage/LoggedOutUserPage';
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
            {/* <Route exact path='/user/:userName'>
              {user is signed in:
                ? (<Route exact path='/user/:userName' component={LoggedOutUser} />)
                : (<Redirect exact path='/user/:userName' to='/home' />)}
              <LoggedOutUser />
            </Route> */}
            <Route
              exact
              path='/user/:userName'
              component={LoggedOutUser}
            />
            <Route exact path='/calendar'>
              <DatePicker mode='request' />
            </Route>
            <Route
              exact
              path='/home'
              component={HomePage}
            />
            <ProtectedRoute
              exact
              path='/dashboard'
              component={UserPage}
            />
            <ProtectedRoute
              // exact
              path='/settings'
              component={UsersSettingsPage}
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

const mapStateToProps = reduxState => ({
  userID: reduxState.user.userAttributes.user_id
});

export default connect(mapStateToProps)(App);
