import { combineReducers } from 'redux';
import searchBGG from './searchingBBGReducers';
import status from './statusReducers';
import errors from './errorsReducer';
import loginMode from './loginModeReducer';
import user from './userReducer';
import searchUsers from './searchUsersReducers';

export default combineReducers({
  searchBGG,
  status,
  // contains registrationMessage and loginMessage
  errors,
  // will have a value of 'login' or 'registration' to control which screen is shown
  loginMode,
  user,
  searchUsers
});
