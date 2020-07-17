import { combineReducers } from 'redux';

// This reducer holdes an object from the server with all the user attributes.
const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'UNSET_USER':
      return {};
    default:
      return state;
  }
};

// An array of all the games a user owns.
const ownedGames = (state = [], action) => {
  switch (action.type) {
    case 'SET_USER_OWNED_GAMES':
      return action.payload;
    case 'RESET_USER_OWNED_GAMES':
      return [];
    default:
      return state;
  }
};

// An array of all the notifications a user has.
const alerts = (state = [], action) => {
  switch (action.type) {
    case 'SET_USER_NOTIFICATION':
      return action.payload;
    case 'CLEAR_USER_NOTIFICATION':
      return [];
    default:
      return state;
  }
};

// An array of all the friends the current user has.
const friends = (state = [], action) => {
  switch (action.type) {
    case 'SET_USER_FRIENDS':
      return action.payload;
    case 'RESET_USER_FRIENDS':
      return [];
    default:
      return state;
  }
};

export default combineReducers({
  userAttributes: userReducer,
  ownedGames,
  friends,
  alerts
});
