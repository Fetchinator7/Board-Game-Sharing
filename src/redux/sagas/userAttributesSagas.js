import { put, takeEvery } from 'redux-saga/effects';
import Axios from 'axios';

function* addGameToUsersCollection(action) {
  console.log('addGameToUsersCollection input:', action);
  try {
    // yield put({ type: 'SHOW_LOADING' });
    // const result = yield Axios.get(`/api/search/game-id/${action.payload}`);
    // yield put({ type: 'SET_RAW_SEARCH_GAMES', payload: [result.data] });
  } catch (error) {
    console.log(`Error adding game with id  "${action.payload}" to user's collection.`, error);
  } finally {
    yield put({ type: 'HIDE_LOADING' });
  }
}

// function* removeGameFromUsersCollection(action) {
//   console.log('addGameToUsersCollection input:', action);
//   try {
//     // yield put({ type: 'SHOW_LOADING' });
//     // const result = yield Axios.get(`/api/search/game-id/${action.payload}`);
//     // yield put({ type: 'SET_RAW_SEARCH_GAMES', payload: [result.data] });
//   } catch (error) {
//     console.log(`Error adding game with id  "${action.payload}" to user's collection.`, error);
//   } finally {
//     yield put({ type: 'HIDE_LOADING' });
//   }
// }

// function* getUsersGameCollection(action) {
//   try {
//     // yield put({ type: 'SHOW_LOADING' });
//     // const result = yield Axios.get(`/api/search/game-id/${action.payload}`);
//     // yield put({ type: 'SET_RAW_SEARCH_GAMES', payload: [result.data] });
//   } catch (error) {
//     console.log(`Error adding game with id  "${action.payload}" to user's collection.`, error);
//   } finally {
//     yield put({ type: 'HIDE_LOADING' });
//   }
// }

function* updateUserAttributesSaga() {
  yield takeEvery('TOGGLE_USERS_GAMES_OWNED_STATUS', addGameToUsersCollection);
  // yield takeEvery('REMOVE_GAME_FROM_USERS_LIBRARY', removeGameFromUsersCollection);
}

export default updateUserAttributesSaga;
