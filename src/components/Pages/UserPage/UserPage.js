import React, { Component } from 'react';
import { connect } from 'react-redux';
import FriendsTable from '../../Components/UserTable/UserResultsTable';
import Games from './UserGamesTable';
import UserSettings from './UserPageSettings';
import Snack from '../../Components/Snack';

class UserPage extends Component {
  render() {
    const { viewMode } = this.props;
    return (
      <>
        <div>
          <h1 id='welcome'>
            Welcome, {this.props.user.userAttributes.user_name}
          </h1>
          <p>Your Profile Visibility is: {this.props.user.userAttributes.visibility}</p>
        </div>
        <br />
        {/* <Games tableData={this.props.user.ownedGames} /> */}
        {viewMode === 'friends' && <FriendsTable tableData={this.props.user.friends} />}
        {viewMode === 'games' && <Games />}
        {viewMode === 'settings' && <UserSettings />}
        <Snack
          onCloseDispatchText='CLEAR_PROFILE_EDIT_ERROR'
          autoHideDuration={null}
          message={this.props.errors.editProfileFailureMessage}
          severity='error'
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  errors: state.errors
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPage);
