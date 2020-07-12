import { combineReducers } from 'redux';
import searchBGG from './searchingBBGReducers';
import status from './statusReducers';
import errors from './errorsReducer';
import success from './successReducer';
import loginMode from './loginModeReducer';
import allDataBaseBGGGames from './allDataBaseGamesReducer';
import user from './userReducer';
import loggedOut from './loggedOutUserReducer';
import searchUsers from './searchUsersReducers';

export default combineReducers({
  loginMode,
  user,
  status,
  errors,
  success,
  allDataBaseBGGGames,
  searchBGG,
  searchUsers,
  loggedOut
});
