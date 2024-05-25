import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

import { isDataRequestAction, makeDataResponseMeta } from '../state/utilities';
import {
  SMUGMUG_API_KEY,
  SMUGMUG_NICKNAME,
} from '../shared/constants/env-constants';
import {
  convertQueryStringToObject,
  fastCryptoHash,
  getDataAsParameterString,
  Oauth,
  SMUGMUG_AUTHORIZE_URL,
  SMUGMUG_REQUEST_TOKEN_URL,
  sortObjectProperties,
} from '../shared/oauth';

import {
  smugmugRequestTokenAction,
  smugmugAuthorizationUrlAction,
  smugmugCredentialsAction,
  smugmugOauthAction,
  smugmugTestDataAction,
} from '../state/api/actions';

export async function makeSmugmugRequest(url, options = {}, headers = {}) {
  const reqOpts = {
    headers: {
      ...headers,
      Accept: 'application/json',
    },
    url,
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
  const { successAction, successPayloadTransform, errorAction } = options;

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
      const data = successPayloadTransform
        ? successPayloadTransform(apiResponse)
        : apiResponse;
      console.log('callApi:transform', {
        apiResponse,
        data,
      });
      yield put(successAction(data, makeDataResponseMeta()));
    }
  } catch (apiSuccessErr) {
    console.error('caught error dispatching success action', apiSuccessErr);
  }
  return true;
}

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

export function* smugmugOauthSaga() {
  yield put(smugmugOauthAction({}, makeDataResponseMeta()));
}

export function* smugmugGetRequestTokenSaga({
  payload: { smugmugApiKey, smugmugApiSecret },
}) {
  const oauth = new Oauth({
    consumer: { key: smugmugApiKey, secret: smugmugApiSecret },
    signature_method: 'HMAC-SHA1',
    hash_function: fastCryptoHash,
  });

  const request = {
    url: SMUGMUG_REQUEST_TOKEN_URL,
    method: 'POST',
    data: {
      oauth_callback: 'oob',
    },
  };

  const headers = {
    Accept: 'application/json',
    ...oauth.toHeader(oauth.authorize(request), { oauth_callback: 'oob' }),
  };

  let captureSuccessPayload;
  let captureSuccessMeta;
  const apiResult = yield* callApi(
    postRequest,
    [request.url, request.data, headers],
    {
      successAction: (payload, meta) => {
        captureSuccessPayload = payload;
        captureSuccessMeta = meta;
        return smugmugRequestTokenAction(payload, meta);
      },
      successPayloadTransform: convertQueryStringToObject,
      errorAction: smugmugRequestTokenAction,
    },
  );

  if (apiResult && !captureSuccessMeta?.error) {
    const properties = {
      oauth_token: encodeURIComponent(captureSuccessPayload.oauth_token),
      access: 'Full',
      permissions: 'Modify',
    };
    const url = `${SMUGMUG_AUTHORIZE_URL}?${getDataAsParameterString(
      sortObjectProperties(properties),
    )}`;

    yield put(smugmugAuthorizationUrlAction(url, makeDataResponseMeta()));
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(
      action => isDataRequestAction(action, smugmugTestDataAction),
      smugmugTestApiSaga,
    ),
    takeEvery(
      action => isDataRequestAction(action, smugmugOauthAction),
      smugmugOauthSaga,
    ),
    takeEvery(
      action => isDataRequestAction(action, smugmugRequestTokenAction),
      smugmugGetRequestTokenSaga,
    ),
  ]);
}
