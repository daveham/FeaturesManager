import axios from 'axios';
import { call, put, select } from 'redux-saga/effects';

import {
  API_V2,
  fastCryptoHash,
  Oauth,
  SMUGMUG_API_ORIGIN,
  SMUGMUG_BASE_URL,
} from 'shared/oauth';
import {
  smugmugAccessTokenSelector,
  smugmugConsumerCredentialsSelector,
} from 'state/api/selectors';
import { openSnackbar } from 'state/ui/actions';
import {
  makeDataResponseMeta,
  makeErrorDataResponseMeta,
} from 'state/utilities';

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
      // If axios provides data for the error, don't throw an exception
      // and let the caller extract useful information to report.
      if (err.response?.data) {
        return {
          isError: true, // a hint to the caller to look at the error info
          ...err.response.data,
        };
      }
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
  const {
    responseAction,
    successAction,
    successPayloadTransform,
    errorAction,
    successMessage,
    errorMessage,
    controlledErrorTransform,
  } = options;

  // use separate actions or common response action
  const resolvedSuccessAction = successAction || responseAction;
  const resolvedErrorAction = errorAction || responseAction;

  let apiResponse;
  try {
    apiResponse = yield call(fn, ...args);
  } catch (err) {
    if (resolvedErrorAction) {
      const message = err?.body?.message ?? err?.message ?? err;
      yield put(resolvedErrorAction(message, makeErrorDataResponseMeta()));
      const resolvedErrorMessage = errorMessage || message || 'Oops';
      yield put(openSnackbar({ text: resolvedErrorMessage, error: true }));
    }
    return false;
  }

  // check for an error not reported via an exception
  if (apiResponse.isError) {
    let controlledErrorMessage;
    if (controlledErrorTransform) {
      // The caller has provided a function to extract an error message
      // from the error response.
      controlledErrorMessage = controlledErrorTransform(apiResponse);
    }
    // Provide a default error message in the absence of anything else.
    if (!controlledErrorMessage) {
      controlledErrorMessage = 'An error occurred calling the API.';
    }
    yield put(
      resolvedErrorAction(controlledErrorMessage, makeErrorDataResponseMeta()),
    );
    yield put(openSnackbar({ text: controlledErrorMessage, error: true }));
    return false;
  }

  try {
    if (resolvedSuccessAction) {
      const data = successPayloadTransform
        ? successPayloadTransform(apiResponse)
        : apiResponse;
      yield put(resolvedSuccessAction(data, makeDataResponseMeta()));

      if (successMessage) {
        yield put(openSnackbar({ text: successMessage }));
      }
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

  const v2Index = url.indexOf(API_V2);
  const fullUrl =
    v2Index >= 0 ? `${SMUGMUG_API_ORIGIN}${url}` : `${SMUGMUG_BASE_URL}${url}`;

  const request = {
    url: fullUrl,
    method,
  };

  const headers = oauth.toHeader(oauth.authorize(request, token), {
    Accept: 'application/json',
  });

  return [request.url, headers];
}
