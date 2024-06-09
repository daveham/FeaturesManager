import { all, put, takeEvery } from 'redux-saga/effects';

import { isDataRequestAction, makeDataResponseMeta } from 'state/utilities';

import { userDataAction } from 'state/user/actions';

const mockData = {
  js: { firstName: 'John', lastName: 'Smith' },
  bf: { firstName: 'Ben', lastName: 'Franklin' },
};

const empty = {};

export function* userApiSaga({ payload }) {
  const data = mockData[payload] ?? empty;
  yield put(userDataAction(data, makeDataResponseMeta()));
}

export default function* rootSaga() {
  yield all([
    takeEvery(
      action => isDataRequestAction(action, userDataAction),
      userApiSaga,
    ),
  ]);
}
