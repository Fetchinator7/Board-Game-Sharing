import { combineReducers } from 'redux';

const otherUsersGames = (state = [], action) => {
  switch (action.type) {
    case 'SET_A_DIFFERENT_USERS_OWNED_GAMES':
      return action.payload;
    case 'CLEAR_A_DIFFERENT_USERS_OWNED_GAMES':
      return [];
    default:
      return state;
  }
};

const otherUsersProfileIsPublic = (state = true, action) => {
  switch (action.type) {
    case 'SET_A_DIFFERENT_USERS_PROFILE_VISIBILITY':
      return action.payload;
    case 'CLEAR_A_DIFFERENT_USERS_PROFILE_VISIBILITY':
      return false;
    default:
      return state;
  }
};

const otherUsersGamesServerErrorMessage = (state = '', action) => {
  switch (action.type) {
    case 'SET_ERROR_GETTING_A_DIFFERENT_USERS_GAMES':
      return action.payload;
    case 'CLEAR_ERROR_GETTING_A_DIFFERENT_USERS_GAMES':
      return '';
    default:
      return state;
  }
};

export default combineReducers({
  otherUsersGames,
  otherUsersProfileIsPublic,
  otherUsersGamesServerErrorMessage
});
