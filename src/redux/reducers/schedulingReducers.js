import { combineReducers } from 'redux';

const requestedLoans = (state = [], action) => {
  switch (action.type) {
    case 'SET_LOAN_REQUEST_TIME_FRAME':
      return [].concat(...state, action.payload);
    default:
      return state;
  }
};

const blockOutDays = (state = [], action) => {
  switch (action.type) {
    case 'SET_BLOCK_OUT_TIME_FRAME':
      return [].concat(...state, action.payload);
    default:
      return state;
  }
};

export default combineReducers({
  requests: requestedLoans,
  blockOuts: blockOutDays
});
