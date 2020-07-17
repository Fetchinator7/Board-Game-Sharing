import { combineReducers } from 'redux';

// loginMessage holds the string that will display
// on the login screen if there's an error
const loginMessage = (state = '', action) => {
  switch (action.type) {
    case 'CLEAR_LOGIN_ERROR':
      return '';
    case 'LOGIN_INPUT_ERROR':
      return 'Enter your username and password!';
    case 'LOGIN_FAILED':
      return 'Oops! The username and password didn\'t match. Try again!';
    case 'LOGIN_FAILED_NO_CODE':
      return 'Unable to connect. Please try again shortly.';
    default:
      return state;
  }
};

// registrationMessage holds the string that will display
// on the registration screen if there's an error
const registrationMessage = (state = '', action) => {
  switch (action.type) {
    case 'CLEAR_REGISTRATION_ERROR':
      return '';
    case 'REGISTRATION_INPUT_ERROR':
      return 'Choose a username and password!';
    case 'REGISTRATION_FAILED':
      return 'Error, that username may already be taken. Try again!';
    default:
      return state;
  }
};

// This will display an error message if there's an error editing the user's games.
const editGamesFailureMessage = (state = '', action) => {
  switch (action.type) {
    case 'SET_EDIT_GAMES_ERROR':
      return action.payload;
    case 'CLEAR_EDIT_GAMES_ERROR':
      return '';
    default:
      return state;
  }
};

// This will display an error if there was an error updating the user's profile (privacy settings).
const editProfileFailureMessage = (state = '', action) => {
  switch (action.type) {
    case 'SET_PROFILE_EDIT_ERROR':
      return action.payload;
    case 'CLEAR_PROFILE_EDIT_ERROR':
      return '';
    default:
      return state;
  }
};

export default combineReducers({
  loginMessage,
  registrationMessage,
  editGamesMessage: editGamesFailureMessage,
  editProfileFailureMessage
});
