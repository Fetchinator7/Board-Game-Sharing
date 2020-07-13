import axios from 'axios';
import { takeEvery } from 'redux-saga/effects';
import moment from 'moment';

function* friendRequest(action) {
  try {
    const friendRequest = yield axios.post('/api/search/users/friend-request', {
      userID: action.payload.userID,
      friendRequestUserID: action.payload.friendRequestUserID,
      message: action.payload.message
    });
    yield axios.post('/api/user/notification', {
      userID: action.payload.userID,
      createdAt: moment(),
      // TODO Do a join table to get the username instead of their id.
      alertText: `A user with the ID "${action.payload.friendRequestUserID}" wants to be your friend and said: "${action.payload.message}"`,
      friendRequestID: friendRequest.data.rows[0].request_id,
      loanedGameID: null
    });
    // SET_USER_NOTIFICATION
    // TODO create a new alert to display in a user's notifications.
    // TODO update the global state so it can display if a friend request is pending,
    // or the user in question blocked the current user.
    // TODO Display a sent request message?
  } catch (error) {
    // TODO display error snack if there was an error making the request.
    console.log('User get request failed', error);
  }
}

function* userSaga() {
  yield takeEvery('CREATE_FRIEND_REQUEST', friendRequest);
}

export default userSaga;
