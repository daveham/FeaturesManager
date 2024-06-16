import { all, takeEvery } from 'redux-saga/effects';

import {
  SMUGMUG_API_KEY,
  SMUGMUG_NICKNAME,
} from 'shared/constants/env-constants';
import { smugmugTestDataAction } from 'state/api/actions';
import { isDataRequestAction } from 'state/utilities';

import { callApi, getRequest } from './apiUtils';

// An example un-authenticated request that allows retrieving read-only data
// by appending the API key to the end of the URL. This does not require any
// OAuth mechanisms (tokens or encrypted authorization header).
export function* smugmugTestApiSaga() {
  yield* callApi(
    getRequest,
    [
      `https://api.smugmug.com/api/v2/user/${SMUGMUG_NICKNAME}?APIKey=${SMUGMUG_API_KEY}`,
    ],
    {
      successAction: smugmugTestDataAction,
      errorAction: smugmugTestDataAction,
    },
  );
}

export default function* rootSaga() {
  yield all([
    takeEvery(
      action => isDataRequestAction(action, smugmugTestDataAction),
      smugmugTestApiSaga,
    ),
  ]);
}
