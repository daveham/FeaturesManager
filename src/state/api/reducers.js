import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import { isDataResponseAction } from '../utilities';
import {
  smugmugAuthorizationUrlAction,
  smugmugConsumerCredentialsAction,
  smugmugAccessTokenAction,
  smugmugRequestTokenAction,
  smugmugVerificationPinAction,
} from './actions';
import {
  SMUGMUG_ACCESS_TOKEN,
  SMUGMUG_ACCESS_TOKEN_SECRET,
} from '../../shared/constants/env-constants';

const CONSUMER_CREDENTIALS_INITIAL_STATE = { key: '', secret: '' };

export const smugmugConsumerCredentials = handleActions(
  {
    [smugmugConsumerCredentialsAction]: (_state, { payload }) => payload,
  },
  CONSUMER_CREDENTIALS_INITIAL_STATE,
);

const REQUEST_TOKEN_INITIAL_STATE = {
  oauth_token: '',
  oauth_token_secret: '',
  oauth_callback_confirmed: false,
};

export const smugmugRequestToken = handleActions(
  {
    [smugmugRequestTokenAction]: (state, action) =>
      isDataResponseAction(action) ? action.payload : state,
  },
  REQUEST_TOKEN_INITIAL_STATE,
);

const AUTHORIZATION_URL_INITIAL_STATE = '';

export const smugmugAuthorizationUrl = handleActions(
  {
    [smugmugAuthorizationUrlAction]: (state, action) =>
      isDataResponseAction(action) ? action.payload : state,
  },
  AUTHORIZATION_URL_INITIAL_STATE,
);

const VERIFICATION_PIN_INITIAL_STATE = '';

export const smugmugVerificationPin = handleActions(
  {
    [smugmugVerificationPinAction]: (_state, { payload }) => payload,
  },
  VERIFICATION_PIN_INITIAL_STATE,
);

const ACCESS_TOKEN_INITIAL_STATE = {
  // access_token: '',
  // access_token_secret: '',
  access_token: SMUGMUG_ACCESS_TOKEN,
  access_token_secret: SMUGMUG_ACCESS_TOKEN_SECRET,
};

export const smugmugAccessToken = handleActions(
  {
    [smugmugAccessTokenAction]: (state, action) =>
      isDataResponseAction(action) ? action.payload : state,
  },
  ACCESS_TOKEN_INITIAL_STATE,
);

export default combineReducers({
  smugmugConsumerCredentials,
  smugmugRequestToken,
  smugmugAuthorizationUrl,
  smugmugVerificationPin,
  smugmugAccessToken,
});
