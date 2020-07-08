import { combineReducers } from 'redux';
import searchBGG from './searchingBBGReducers';
import status from './statusReducers';
import games from './gamesReducer';
import scheduling from './schedulingReducers';
import errors from './errorsReducer';
import loginMode from './loginModeReducer';
import user from './userReducer';

export default combineReducers({
  searchBGG,
  status,
  games,
  scheduling,
  // contains registrationMessage and loginMessage
  errors,
  // will have a value of 'login' or 'registration' to control which screen is shown
  loginMode,
  user
});
