import { all } from 'redux-saga/effects';

import apiSagas from './apiSagas';
import userSagas from './userSagas';

export default function* rootSaga() {
  yield all([userSagas(), apiSagas()]);
}
