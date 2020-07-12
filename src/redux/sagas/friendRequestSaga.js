import axios from 'axios';
import { takeEvery } from 'redux-saga/effects';

function* friendRequest(action) {
  try {
    yield axios.post('/api/search/users/friend-request', {
      userID: action.payload.userID,
      friendRequestUserID: action.payload.friendRequestUserID,
      message: action.payload.message
    });
    // TODO create a new alert to display in a user's notifications.
    // TODO update the global state so it can display if a friend request is pending,
    // or the user in question blocked the current user.
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* userSaga() {
  yield takeEvery('CREATE_FRIEND_REQUEST', friendRequest);
}

export default userSaga;
