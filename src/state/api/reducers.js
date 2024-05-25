import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import {
  smugmugAuthorizationUrlAction,
  smugmugCredentialsAction,
  smugmugRequestTokenAction,
} from './actions';
import { isDataResponseAction } from '../utilities';

const CREDENTIALS_INITIAL_STATE = { key: '', secret: '' };

export const smugmugCredentials = handleActions(
  {
    [smugmugCredentialsAction]: (_state, { payload }) => payload,
  },
  CREDENTIALS_INITIAL_STATE,
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

export default combineReducers({
  smugmugAuthorizationUrl,
  smugmugCredentials,
  smugmugRequestToken,
});
