import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get('/api/user', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER_IS_LOGGED_IN' });
    yield put({ type: 'SET_USER', payload: response.data });
    const userGames = yield axios.get('/api/user/games');
    yield put({ type: 'SET_USER_OWNED_GAMES', payload: userGames.data });
    const allDataBaseBGGGameIDs = yield axios.get('/api/game/management/all-database-games');
    yield put({ type: 'SET_ALL_DATABASE_GAMES', payload: allDataBaseBGGGameIDs.data.rows });
    const usersFriends = yield axios.get('/api/search/users/friends');
    yield put({ type: 'SET_USER_FRIENDS', payload: usersFriends.data });
    const usersNewNotifications = yield axios.get('/api/user/notifications/');
    yield put({ type: 'SET_USER_NOTIFICATION', payload: usersNewNotifications.data.rows });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* updateUsersPrivacySetting(action) {
  try {
    yield axios.put('/api/user/settings-privacy', {
      newVisibility: action.payload.newVisibility
    });
    yield put({ type: 'FETCH_USER' });
  } catch (error) {
    if (String(error).includes('403')) {
      yield put({ type: 'SET_PROFILE_EDIT_ERROR', payload: "Error updating account because you're not authorized. Are you singed in?" });
    } else {
      yield put({ type: 'SET_PROFILE_EDIT_ERROR', payload: 'Error updating account.' });
    }
  }
}

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('CHANGE_USERS_PROFILE_VISIBILITY', updateUsersPrivacySetting);
}

export default userSaga;
