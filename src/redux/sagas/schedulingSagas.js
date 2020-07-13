import { takeEvery, select, put } from 'redux-saga/effects';
import Axios from 'axios';
import moment from 'moment';

function* requestLoan(action) {
  try {
    const globalState = yield select();
    yield Axios.post('/api/search/users/borrow-game-request', {
      gameID: action.payload.gameID,
      userID: globalState.user.userAttributes.user_id,
      ownerID: action.payload.ownerID,
      startDate: action.payload.startDate,
      endDate: action.payload.endDate
    });
    // TODO display the name of the game instead of the id.
    yield Axios.post('/api/user/notification', {
      otherUserID: action.payload.ownerID,
      createdAt: moment(),
      alertText: `Your friend with the ID "${globalState.user.userAttributes.user_id}" wants to borrow your game with ID: "${action.payload.gameID}"`,
      loanedGameID: action.payload.gameID,
      friendRequestID: null
    });
    yield put({ type: 'SET_GAME_LOAN_CREATION_SUCCESS_FOR_A_DIFFERENT_USER', payload: 'Successfully submitted loan request!' });
  } catch (error) {
    yield put({ type: 'SET_ERROR_FROM_A_DIFFERENT_USER', payload: 'Error making server loan request' });
    console.log('Error', error);
  }
}

function* setBlockOut(action) {
  console.log('setBlockOut input:', action);
  try {
    // const result = yield Axios.get(`/api/search/game-id/${action.payload}`);
    // yield put({ type: 'SET_RAW_SEARCH_GAMES', payload: [result.data] });
  } catch (error) {
    console.log('Error', error);
  }
}

function* updateUserAttributesSaga() {
  yield takeEvery('SET_LOAN_REQUEST_TIME_FRAME', requestLoan);
  yield takeEvery('SET_BLOCK_OUT_TIME_FRAME', setBlockOut);
}

export default updateUserAttributesSaga;
