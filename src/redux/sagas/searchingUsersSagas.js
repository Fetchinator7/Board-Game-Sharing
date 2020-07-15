import { put, takeLatest, putResolve } from 'redux-saga/effects';
import Axios from 'axios';

function* searchUsers(action) {
  try {
    yield put({ type: 'SHOW_LOADING' });
    yield put({ type: 'RESET_USER_SEARCH_RESULTS' });
    yield putResolve({ type: 'RESET_USER_SEARCH__USER_NOT_FOUND' });
    const result = yield Axios.get(`/api/search/users/username/${action.payload}`);
    const hasResults = result.data.length === 0;
    if (hasResults) {
      yield put({ type: 'SET_USER_SEARCH__USER_NOT_FOUND', payload: `Error, username "${action.payload}" not found.` });
    }
    yield put({ type: 'SET_USER_SEARCH_RESULTS', payload: [result.data] });
  } catch (error) {
    yield put({ type: 'SET_USER_SEARCH__USER_NOT_FOUND', payload: `Error, unable to search for user: "${action.payload}"` });
  } finally {
    yield put({ type: 'HIDE_LOADING' });
  }
}

function* searchingDataBaseUsersSaga() {
  yield takeLatest('FETCH_USERS', searchUsers);
}

export default searchingDataBaseUsersSaga;
