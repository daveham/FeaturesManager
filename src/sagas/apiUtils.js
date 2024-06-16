import axios from 'axios';
import { call, put, select } from 'redux-saga/effects';

import { fastCryptoHash, Oauth, SMUGMUG_BASE_URL } from 'shared/oauth';
import {
  smugmugAccessTokenSelector,
  smugmugConsumerCredentialsSelector,
} from 'state/api/selectors';
import { makeDataResponseMeta } from 'state/utilities';

// Unauthenticated Requests
export function makeSmugmugRequest(url, options = {}, headers = {}) {
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

export function* prepareAuthRequest(url, method = 'GET') {
  const { key, secret } = yield select(smugmugConsumerCredentialsSelector);
  const { access_token, access_token_secret } = yield select(
    smugmugAccessTokenSelector,
  );

  const oauth = new Oauth({
    consumer: { key, secret },
    signature_method: 'HMAC-SHA1',
    hash_function: fastCryptoHash,
  });

  const token = { key: access_token, secret: access_token_secret };

  const request = {
    url: `${SMUGMUG_BASE_URL}${url}`,
    method,
  };

  const headers = oauth.toHeader(oauth.authorize(request, token), {
    Accept: 'application/json',
  });

  return [request.url, headers];
}
