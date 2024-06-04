import { createActions } from 'redux-actions';

import { createActionMapForData } from '../utilities';

const dataActionsMap = createActionMapForData([
  'DROPBOX_TEST_DATA',
  'SMUGMUG_ACCESS_TOKEN',
  'SMUGMUG_AUTHORIZATION_URL',
  'SMUGMUG_OAUTH',
  'SMUGMUG_REQUEST_TOKEN',
  'SMUGMUG_TEST_REQUEST',
  'SMUGMUG_TEST_DATA',
]);

const identityActions = [
  'SMUGMUG_CONSUMER_CREDENTIALS_ACTION',
  'SMUGMUG_VERIFICATION_PIN_ACTION',
];

export const {
  // DropBox Data Actions
  dropboxTestDataAction,

  // SmugMug Data Actions
  smugmugAccessTokenAction,
  smugmugAuthorizationUrlAction,
  smugmugOauthAction,
  smugmugRequestTokenAction,
  smugmugTestRequestAction,
  smugmugTestDataAction,

  // SmugMug Identity Actions
  smugmugConsumerCredentialsAction,
  smugmugVerificationPinAction,
} = createActions(dataActionsMap, ...identityActions);
