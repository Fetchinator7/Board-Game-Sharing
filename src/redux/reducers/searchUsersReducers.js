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

const noUserFoundError = (state = '', action) => {
  switch (action.type) {
    case 'SET_USER_SEARCH__USER_NOT_FOUND':
      return action.payload;
    case 'RESET_USER_SEARCH__USER_NOT_FOUND':
      return '';
    default:
      return state;
  }
};

const sentFriendRequestSuccessMessage = (state = '', action) => {
  switch (action.type) {
    case 'SET_FRIEND_REQUEST_SENT_SUCCESSFULLY':
      return action.payload;
    case 'CLEAR_FRIEND_REQUEST_SENT_SUCCESSFULLY':
      return '';
    default:
      return state;
  }
};

export default combineReducers({
  usersSearchResults: usersReducer,
  noResultsErrorText: noUserFoundError,
  sentFriendRequestSuccessMessage
});
