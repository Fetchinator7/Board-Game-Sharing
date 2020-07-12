import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchLoggedOutUser(action) {
  try {
    const user = yield axios.get(`/api/search/users/user/profile/${action.payload}`);
    yield put({ type: 'SET_A_DIFFERENT_USERS_OWNED_GAMES', payload: user.data });
    const userID = yield axios.get(`/api/search/users/user/ID/${action.payload}`);
    yield put({ type: 'SET_A_DIFFERENT_USERS_ID', payload: userID.data.rows[0].user_id });
    // yield put({ type: 'SET_A_DIFFERENT_USERS_PROFILE_VISIBILITY', payload: user.data });
  } catch (error) {
    if (String(error).includes('403')) {
      yield put({ type: 'SET_ERROR_FROM_A_DIFFERENT_USER', payload: "Error, you don't have permission to view this user's games." });
    } else {
      yield put({ type: 'SET_ERROR_FROM_A_DIFFERENT_USER', payload: 'User get request failed.' });
    }
  }
}

function* userSaga() {
  yield takeLatest('FETCH_A_DIFFERENT_USER', fetchLoggedOutUser);
}

export default userSaga;
