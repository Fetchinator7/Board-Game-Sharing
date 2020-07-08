import { put, takeLatest } from 'redux-saga/effects';
import Axios from 'axios';

function* searchUsers(action) {
  console.log('getUserInfo input:', action);
  try {
    yield put({ type: 'SHOW_LOADING' });
    yield put({ type: 'RESET_USER_SEARCH_RESULTS' });
    const result = yield Axios.get(`/api/search/users/username/${action.payload}`);
    yield put({ type: 'SET_USER_SEARCH_RESULTS', payload: [result.data] });
  } catch (error) {
    console.log(`error fetching user info for username "${action.payload}"`, error);
  } finally {
    yield put({ type: 'HIDE_LOADING' });
  }
}

function* searchingBBGSaga() {
  yield takeLatest('FETCH_USERS', searchUsers);
}

export default searchingBBGSaga;
