import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../../App/LogOutButton/LogOutButton';
import FriendsTable from '../../Components/UserTable/UserResultsTable';
import GamesTable from '../SearchPageGames/SearchPageGamesTable';
import Games from './UserGamesTable';

class UserPage extends Component {
  render() {
    return (
      <>
        <div>
          <h1 id='welcome'>
            Welcome, {this.props.user.userAttributes.user_name}
          </h1>
          <p>Your Profile Visibility is: {this.props.user.userAttributes.visibility}</p>
          <LogOutButton className='log-in' />
        </div>
        <br />
        {/* <Games tableData={this.props.user.ownedGames} /> */}
        <FriendsTable tableData={this.props.user.friends} />
      </>
    );
  }
}

// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
  errors: state.errors
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPage);
