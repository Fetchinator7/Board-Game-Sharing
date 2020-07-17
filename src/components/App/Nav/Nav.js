import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import Notifications from '../../Components/Notifications/Notifications';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import './Nav.css';

const Nav = (props) => (
  <div className='nav'>
    <Link to='/home'>
      <h2 className='nav-title'>Board Game Loaner</h2>
    </Link>
    <div className='nav-right'>
      {/* Show the link to the users search page and the games search page if the user is logged in. */}
      <Link className='nav-link' to='/search/users'>
        <SearchIcon />
        Users
      </Link>
      <Link className='nav-link' to='/search/games'>
        <SearchIcon />
         Games
      </Link>
      <Link className='nav-link' to='/dashboard'>
        {props.status.userIsSignedIn ? 'Dashboard' : 'Login / Register'}
      </Link>
      {/* Display these links if the user is logged in. */}
      {props.status.userIsSignedIn && (
        <>
          <Link className='nav-link' to='/friends'>
            Friends
          </Link>
          {/* Open the notifications drop-down. */}
          <Notifications className='nav-link' />
          {/* Show a gear icon to represent the settings page. */}
          <Link className='nav-link' to='/settings'>
            <SettingsIcon />
          </Link>
          <LogOutButton className='nav-link' />
        </>
      )}
    </div>
  </div>
);

const mapStateToProps = state => ({
  user: state.user,
  status: state.status
});

export default connect(mapStateToProps)(Nav);
