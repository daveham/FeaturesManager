import { all, call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

import { isDataRequestAction, makeDataResponseMeta } from '../state/utilities';
import {
  SMUGMUG_API_KEY,
  SMUGMUG_NICKNAME,
} from '../shared/constants/env-constants';

import { smugmugTestDataAction } from '../state/api/actions';

export async function makeSmugmugRequest(url, options = {}, headers = {}) {
  const reqOpts = {
    headers: {
      ...headers,
      Accept: 'application/json',
    },
    url: `${url}?APIKey=${SMUGMUG_API_KEY}`,
    ...options,
  };
  return axios(reqOpts).then(
    response => {
      return response.data;
    },
    err => {
      throw err;
    },
  );
}

export function getRequest(url, headers) {
  console.log('getRequest', { url, headers });
  return makeSmugmugRequest(url, { method: 'GET' }, headers);
}
export function postRequest(url, data = {}, headers) {
  return makeSmugmugRequest(url, { method: 'POST', data }, headers);
}
export function putRequest(url, data = {}, headers) {
  return makeSmugmugRequest(url, { method: 'PUT', data }, headers);
}
export function deleteRequest(url, data = {}, headers) {
  return makeSmugmugRequest(url, { method: 'DELETE', data }, headers);
}

export function* callApi(fn, args, options = {}) {
  const { successAction, errorAction } = options;

  console.log('callApi', ...args);
  let apiResponse;
  try {
    apiResponse = yield call(fn, ...args);
  } catch (err) {
    if (errorAction) {
      const message = err?.body?.message ?? err?.message ?? err;
      yield put(errorAction(message, makeDataResponseMeta({ error: true })));
    }
    return false;
  }

  try {
    if (successAction) {
      yield put(successAction(apiResponse, makeDataResponseMeta()));
    }
  } catch (apiSuccessErr) {
    console.error('caught error dispatching success action', apiSuccessErr);
  }
  return true;
}

export function* smugmugTestApiSaga({ payload }) {
  yield* callApi(
    getRequest,
    [`https://api.smugmug.com/api/v2/user/${SMUGMUG_NICKNAME}`],
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
