import { combineReducers } from 'redux';

const ownedGames = (state = [], action) => {
  switch (action.type) {
    case 'SET_USER_OWNED_GAMES':
      return action.payload;
    default:
      return state;
  }
};

const requestedLoans = (state = [], action) => {
  switch (action.type) {
    case 'SET_USER_REQUESTED_LOANS':
      return action.payload;
    default:
      return state;
  }
};

const acceptedLoans = (state = [], action) => {
  switch (action.type) {
    case 'SET_USER_ACCEPTED_LOANS':
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  ownedGames,
  requestedLoans,
  acceptedLoans
});
