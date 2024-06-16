import { all, takeEvery } from 'redux-saga/effects';

import { summaryDataAction } from 'state/summary/actions';
import { isDataRequestAction } from 'state/utilities';

import { callApi, getRequest, prepareAuthRequest } from './apiUtils';

export function* summaryDataSaga(_action) {
  const requestArgs = yield* prepareAuthRequest('!authuser');
  const apiResult = yield* callApi(getRequest, requestArgs, {
    successAction: summaryDataAction,
    errorAction: summaryDataAction,
    successPayloadTransform: data => {
      const { Uris, ...userProps } = data.Response.User;
      return userProps;
    },
  });
  console.log('summaryDataSaga', { apiResult });
}

export default function* rootSaga() {
  yield all([
    takeEvery(
      action => isDataRequestAction(action, summaryDataAction),
      summaryDataSaga,
    ),
  ]);
}
