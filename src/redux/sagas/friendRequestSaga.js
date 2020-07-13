import axios from 'axios';
import { takeEvery, select, put } from 'redux-saga/effects';
import moment from 'moment';

function* friendRequest(action) {
  try {
    const friendRequest = yield axios.post('/api/search/users/friend-request', {
      userID: action.payload.userID,
      friendRequestUserID: action.payload.friendRequestUserID,
      message: action.payload.message
    });
    yield axios.post('/api/user/notification', {
      otherUserID: action.payload.friendRequestUserID,
      createdAt: moment(),
      // TODO Do a join table to get the username instead of their id.
      alertText: `A user with the ID "${action.payload.userID}" wants to be your friend and said: "${action.payload.message}"`,
      friendRequestID: friendRequest.data.rows[0].request_id,
      loanedGameID: null
    });
    yield put({ type: 'SET_FRIEND_REQUEST_SENT_SUCCESSFULLY', payload: 'Successfully submitted friend request!' });
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

function* updateRequest(action) {
  try {
    const globalState = yield select();
    yield axios.post('/api/search/users//update-friend-request', {
      viewedAt: moment(),
      alertID: action.payload.alertID,
      agreed: action.payload.agreed,
      userID: globalState.user.userAttributes.user_id,
      friendRequestID: action.payload.friendRequestID
    });
    yield put({ type: 'SET_FRIEND_REQUEST_SENT_SUCCESSFULLY', payload: 'Successfully added this friend!' });
  } catch (error) {
    yield put({ type: 'SET_USER_SEARCH__USER_NOT_FOUND', payload: 'Server error trying to make the friend request' });
    console.log('Error', error);
  }
}

function* userSaga() {
  yield takeEvery('CREATE_FRIEND_REQUEST', friendRequest);
  yield takeEvery('SET_FRIEND_REQUEST_UPDATED_STATE', updateRequest);
}

export default userSaga;
