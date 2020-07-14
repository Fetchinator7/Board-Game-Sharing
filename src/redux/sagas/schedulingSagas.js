import { takeEvery, select, put } from 'redux-saga/effects';
import Axios from 'axios';
import moment from 'moment';

function* requestLoan(action) {
  try {
    Axios.post('/api/search/users/other-user-request', {
      gameID: action.payload.gameID,
      otherUserID: action.payload.otherUserID,
      startDate: action.payload.startDate,
      endDate: action.payload.endDate,
      actionType: 'loan'
    });
    // TODO display the name of the game instead of the id.
    yield put({ type: 'SET_GAME_LOAN_CREATION_SUCCESS_FOR_A_DIFFERENT_USER', payload: 'Successfully submitted loan request!' });
  } catch (error) {
    yield put({ type: 'SET_ERROR_FROM_A_DIFFERENT_USER', payload: 'Server error trying to make the loan request' });
    console.log('Error', error);
  }
}

function* updateLoan(action) {
  try {
    const globalState = yield select();
    yield Axios.post('/api/search/users/update-borrow-game-request', {
      viewedAt: moment(),
      alertID: action.payload.alertID,
      agreed: action.payload.agreed,
      userID: globalState.user.userAttributes.user_id,
      loanedGameID: action.payload.loanedGameID
    });
    yield put({ type: 'FETCH_USER' });
    // yield put({ type: 'SET_GAME_LOAN_CREATION_SUCCESS_FOR_A_DIFFERENT_USER', payload: 'Successfully submitted loan request!' });
  } catch (error) {
    // yield put({ type: 'SET_ERROR_FROM_A_DIFFERENT_USER', payload: 'Error making server loan request' });
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
  yield takeEvery('SET_LOAN_REQUEST_UPDATED_STATE', updateLoan);
  yield takeEvery('SET_BLOCK_OUT_TIME_FRAME', setBlockOut);
}

export default updateUserAttributesSaga;
