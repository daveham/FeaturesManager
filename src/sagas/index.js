import { all } from 'redux-saga/effects';

import apiSagas from './apiSagas';
import smugmugAuthSagas from './smugmugAuthSagas';
import smugmugDataSagas from './smugmugDataSagas';
import userSagas from './userSagas';

export default function* rootSaga() {
  yield all([apiSagas(), smugmugDataSagas(), smugmugAuthSagas(), userSagas()]);
}
