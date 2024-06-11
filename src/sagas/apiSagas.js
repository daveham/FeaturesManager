import axios from 'axios';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  SMUGMUG_API_KEY,
  SMUGMUG_NICKNAME,
} from 'shared/constants/env-constants';
import {
  convertQueryStringToObject,
  fastCryptoHash,
  getDataAsParameterString,
  Oauth,
  SMUGMUG_ACCESS_TOKEN_URL,
  SMUGMUG_AUTHORIZE_URL,
  SMUGMUG_BASE_URL,
  SMUGMUG_REQUEST_TOKEN_URL,
  sortObjectProperties,
} from 'shared/oauth';
import {
  readFromLocalStorage,
  writeToLocalStorage,
} from 'shared/utilities/storage';
import {
  smugmugAccessTokenAction,
  smugmugAuthorizationUrlAction,
  smugmugLoadFromLocalStorageAction,
  smugmugRequestTokenAction,
  smugmugTestDataAction,
  smugmugTestRequestAction,
  smugmugVerificationPinAction,
} from 'state/api/actions';
import {
  smugmugConsumerCredentialsSelector,
  smugmugRequestTokenSelector,
} from 'state/api/selectors';
import { isDataRequestAction, makeDataResponseMeta } from 'state/utilities';

// Unauthenticated Requests
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

// Helper for calling any of the an-authenticated requests and dispatching
// success or error actions.
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
      yield put(successAction(data, makeDataResponseMeta()));
    }
  } catch (apiSuccessErr) {
    console.error('caught error dispatching success action', apiSuccessErr);
  }
  return true;
}

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

// Step one of OAuth 1.0a process: Use API Key and API Key Secret to acquire
// request token. Then use request token to construct a URL to open in browser
// for user to retrieve verification code.
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

// Step two of OAuth 1.0a process: Use the verification code provided by the
// user to acquire the authentication token and token secret. Save the
// authentication values to local storage. The payload in the action that
// triggers this saga is the six-digit verification code.
export function* smugmugVerifyPinSaga({ payload }) {
  const { smugmugApiKey, smugmugApiSecret } = yield select(
    smugmugConsumerCredentialsSelector,
  );
  const { oauth_token, oauth_token_secret } = yield select(
    smugmugRequestTokenSelector,
  );

  const token = { key: oauth_token, secret: oauth_token_secret };

  const oauth = new Oauth({
    consumer: { key: smugmugApiKey, secret: smugmugApiSecret },
    signature_method: 'HMAC-SHA1',
    hash_function: fastCryptoHash,
  });

  const request = {
    url: SMUGMUG_ACCESS_TOKEN_URL,
    method: 'GET',
    data: {
      oauth_verifier: payload,
    },
  };

  const headers = {
    Accept: 'application/json',
    ...oauth.toHeader(oauth.authorize(request, token), {
      oauth_verifier: payload,
    }),
  };

  let captureSuccessPayload;
  let captureSuccessMeta;
  const apiResult = yield* callApi(getRequest, [request.url, headers], {
    successAction: (successPayload, successMeta) => {
      captureSuccessPayload = successPayload;
      captureSuccessMeta = successMeta;
      return smugmugAccessTokenAction(successPayload, successMeta);
    },
    successPayloadTransform: convertQueryStringToObject,
    errorAction: smugmugAccessTokenAction,
  });

  if (apiResult && !captureSuccessMeta?.error) {
    // write token and secret to local storage
    try {
      const { oauth_token: authToken, oauth_token_secret: authTokenSecret } =
        captureSuccessPayload;
      yield call(writeToLocalStorage, 'authToken', authToken);
      yield call(writeToLocalStorage, 'authTokenSecret', authTokenSecret);
    } catch (e) {
      console.error('exception in smugmugVerifyPinSaga', e);
    }
  }
}

// The first request that is authenticated with OAuth.
// TODO: Use this to create generalized helper saga for making any
//  authenticated request to the SmugMug API.
export function* smugmugTestRequestSaga({
  payload: {
    smugmugApiKey,
    smugmugApiSecret,
    access_token,
    access_token_secret,
  },
}) {
  const token = { key: access_token, secret: access_token_secret };

  const oauth = new Oauth({
    consumer: { key: smugmugApiKey, secret: smugmugApiSecret },
    signature_method: 'HMAC-SHA1',
    hash_function: fastCryptoHash,
  });

  const request = {
    url: `${SMUGMUG_BASE_URL}!authuser`,
    method: 'GET',
  };

  const headers = oauth.toHeader(oauth.authorize(request, token), {
    Accept: 'application/json',
  });

  const apiResult = yield* callApi(getRequest, [request.url, headers], {
    successAction: smugmugTestRequestAction,
    errorAction: smugmugTestRequestAction,
  });
  console.log('smugmugTestRequestSaga', { apiResult });
}

// This saga is triggered shortly after app start to load any OAuth values found
// in local storage into redux state. The presence (or absence) of these values
// in redux is used to enable steps in the authentication UI.
export function* smugmugLoadFromLocalStorageSaga() {
  let authToken;
  let authTokenSecret;
  try {
    authToken = yield call(readFromLocalStorage, 'authToken');
    authTokenSecret = yield call(readFromLocalStorage, 'authTokenSecret');
    yield put(
      smugmugLoadFromLocalStorageAction(
        { authToken, authTokenSecret },
        makeDataResponseMeta(),
      ),
    );
  } catch (e) {
    console.error('exception in smugmugVerifyPinSaga', e);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(
      action => isDataRequestAction(action, smugmugTestDataAction),
      smugmugTestApiSaga,
    ),
    takeEvery(
      action => isDataRequestAction(action, smugmugRequestTokenAction),
      smugmugGetRequestTokenSaga,
    ),
    takeEvery(smugmugVerificationPinAction, smugmugVerifyPinSaga),
    takeEvery(
      action => isDataRequestAction(action, smugmugTestRequestAction),
      smugmugTestRequestSaga,
    ),
    takeEvery(
      action => isDataRequestAction(action, smugmugLoadFromLocalStorageAction),
      smugmugLoadFromLocalStorageSaga,
    ),
  ]);
}
