import { all } from 'redux-saga/effects';
import searchingBBGSagas from './searchingBBGSagas';
import updateUserAttributesSaga from './userAttributesSagas';
import schedulingSagas from './schedulingSagas';
import loginSaga from './loginSaga';
import registrationSaga from './registrationSaga';
import userSaga from './userSaga';
import searchUserSaga from './searchingUsersSagas';

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

export default function* rootSaga() {
  yield all([
    searchingBBGSagas(),
    updateUserAttributesSaga(),
    schedulingSagas(),
    loginSaga(),
    registrationSaga(),
    userSaga(),
    searchUserSaga()
  ]);
}
