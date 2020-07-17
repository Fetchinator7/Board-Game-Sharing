import { combineReducers } from 'redux';

// This will store an array of all the games for the user profile currently being viewed.
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

// Error trying to obtain a different user's games.
const otherUsersGamesServerErrorMessage = (state = '', action) => {
  switch (action.type) {
    case 'SET_ERROR_FROM_A_DIFFERENT_USER':
      return action.payload;
    case 'CLEAR_ERROR_GETTING_A_DIFFERENT_USERS_GAMES':
      return '';
    default:
      return state;
  }
};

// Display a success message if a new loan request was created.
const otherUsersGamesSuccessMessage = (state = '', action) => {
  switch (action.type) {
    case 'SET_GAME_LOAN_CREATION_SUCCESS_FOR_A_DIFFERENT_USER':
      return action.payload;
    case 'CLEAR_GAME_LOAN_CREATION_SUCCESS_FOR_A_DIFFERENT_USER':
      return '';
    default:
      return state;
  }
};

// Set the id of a different user (for sending messages and checking friend status.)
const otherUsersID = (state = 0, action) => {
  switch (action.type) {
    case 'SET_A_DIFFERENT_USERS_ID':
      return action.payload;
    case 'CLEAR_A_DIFFERENT_USERS_ID':
      return 0;
    default:
      return state;
  }
};

export default combineReducers({
  otherUsersID,
  otherUsersGames,
  otherUsersGamesSuccessMessage,
  otherUsersGamesServerErrorMessage
});
