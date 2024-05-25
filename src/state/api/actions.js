import { createActions } from 'redux-actions';

import { createActionMapForData } from '../utilities';

const dataActionsMap = createActionMapForData([
  'SMUGMUG_TEST_DATA',
  'SMUGMUG_OAUTH',
  'SMUGMUG_REQUEST_TOKEN',
  'SMUGMUG_AUTHORIZATION_URL',
  'DROPBOX_TEST_DATA',
]);

const identityActions = ['SMUGMUG_CREDENTIALS_ACTION'];

export const {
  // SmugMug Data Actions
  smugmugTestDataAction,
  smugmugOauthAction,
  smugmugRequestTokenAction,
  smugmugAuthorizationUrlAction,
  // DropBox Data Actions
  dropboxTestDataAction,
  // SmugMug Identity Actions
  smugmugCredentialsAction,
} = createActions(dataActionsMap, ...identityActions);
