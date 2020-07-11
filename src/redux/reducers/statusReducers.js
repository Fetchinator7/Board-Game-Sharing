import { combineReducers } from 'redux';

const showLoadingIcon = (state = false, action) => {
  switch (action.type) {
    case 'SHOW_LOADING':
      return true;
    case 'HIDE_LOADING':
      return false;
    default:
      return state;
  }
};

const loggedInStatus = (state = false, action) => {
  switch (action.type) {
    case 'SET_USER_IS_LOGGED_IN':
      return true;
    case 'SET_USER_IS_LOGGED_OUT':
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  loading: showLoadingIcon,
  userIsSignedIn: loggedInStatus
});
