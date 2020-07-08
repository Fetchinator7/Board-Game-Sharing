import { put, takeEvery } from 'redux-saga/effects';
import Axios from 'axios';

function* requestLoan(action) {
  console.log('requestLoan input:', action);
  try {
    // const result = yield Axios.get(`/api/search/game-id/${action.payload}`);
    // yield put({ type: 'SET_REQUEST_LOAN_GAMES', payload: [result.data] });
  } catch (error) {
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
