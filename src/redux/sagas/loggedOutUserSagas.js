import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchLoggedOutUser(action) {
  try {
    const user = yield axios.get(`/api/search/users/user/profile/${action.payload}`);
    console.log('user:', user);
    yield put({ type: 'SET_A_DIFFERENT_USERS_OWNED_GAMES', payload: user.data });
    // yield put({ type: 'SET_A_DIFFERENT_USERS_PROFILE_VISIBILITY', payload: user.data });
    return 'something';
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* userSaga() {
  yield takeLatest('FETCH_A_DIFFERENT_USER', fetchLoggedOutUser);
}

export default userSaga;
