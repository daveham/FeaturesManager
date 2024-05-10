import { all } from 'redux-saga/effects';
import userSagas from './userSagas';
import apiSagas from './apiSagas';

export default function* rootSaga() {
  yield all([userSagas(), apiSagas()]);
}
