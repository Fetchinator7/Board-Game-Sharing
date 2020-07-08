import { combineReducers } from 'redux';

const usersReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_USER_SEARCH_RESULTS':
      return (action.payload[0]);
    case 'RESET_USER_SEARCH_RESULTS':
      return [];
    default:
      return state;
  }
};

const searchForUser = (state = '', action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER_SEARCH':
      return action.payload;
    case 'RESET_CURRENT_USER_SEARCH':
      return '';
    default:
      return state;
  }
};

export default combineReducers({
  usersSearchResults: usersReducer,
  searchText: searchForUser
});
