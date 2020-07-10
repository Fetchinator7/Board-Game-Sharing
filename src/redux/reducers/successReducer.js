import { combineReducers } from 'redux';

const addedGameToUserCollection = (state = '', action) => {
  switch (action.type) {
    case 'SET_ADDED_GAME_SUCCESS_MESSAGE':
      return action.payload;
    case 'CLEAR_ADDED_GAME_SUCCESS_MESSAGE':
      return '';
    default:
      return state;
  }
};

export default combineReducers({
  addedGameToUserCollection
});
