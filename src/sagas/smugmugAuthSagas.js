import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  convertQueryStringToObject,
  fastCryptoHash,
  getDataAsParameterString,
  Oauth,
  SMUGMUG_ACCESS_TOKEN_URL,
  SMUGMUG_AUTHORIZE_URL,
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
  smugmugVerificationPinAction,
} from 'state/api/actions';
import {
  smugmugConsumerCredentialsSelector,
  smugmugRequestTokenSelector,
} from 'state/api/selectors';
import { isDataRequestAction, makeDataResponseMeta } from 'state/utilities';

import { callApi, getRequest, postRequest } from './apiUtils';

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
    // write token and secret to local storage
    try {
      yield call(writeToLocalStorage, 'smugmugApiKey', smugmugApiKey);
      yield call(writeToLocalStorage, 'smugmugApiSecret', smugmugApiSecret);
    } catch (e) {
      console.error(
        'exception writing to local storage in smugmugVerifyPinSaga',
        e,
      );
    }

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
  const { key, secret } = yield select(smugmugConsumerCredentialsSelector);
  const { oauth_token, oauth_token_secret } = yield select(
    smugmugRequestTokenSelector,
  );

  const token = { key: oauth_token, secret: oauth_token_secret };

  const oauth = new Oauth({
    consumer: { key, secret },
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
      console.error(
        'exception writing to local storage in smugmugVerifyPinSaga',
        e,
      );
    }
  }
}

// This saga is triggered shortly after app start to load any OAuth values found
// in local storage into redux state. The presence (or absence) of these values
// in redux is used to enable steps in the authentication UI.
export function* smugmugLoadFromLocalStorageSaga() {
  try {
    const authToken = yield call(readFromLocalStorage, 'authToken');
    const authTokenSecret = yield call(readFromLocalStorage, 'authTokenSecret');
    const smugmugApiKey = yield call(readFromLocalStorage, 'smugmugApiKey');
    const smugmugApiSecret = yield call(
      readFromLocalStorage,
      'smugmugApiSecret',
    );

    yield put(
      smugmugLoadFromLocalStorageAction(
        { authToken, authTokenSecret, smugmugApiKey, smugmugApiSecret },
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
      action => isDataRequestAction(action, smugmugRequestTokenAction),
      smugmugGetRequestTokenSaga,
    ),
    takeEvery(smugmugVerificationPinAction, smugmugVerifyPinSaga),
    takeEvery(
      action => isDataRequestAction(action, smugmugLoadFromLocalStorageAction),
      smugmugLoadFromLocalStorageSaga,
    ),
  ]);
}
