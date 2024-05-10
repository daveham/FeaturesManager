import { createActions } from 'redux-actions';

import { createActionMapForData } from '../utilities';

const dataActionsMap = createActionMapForData([
  'SMUGMUG_TEST_DATA',
  'DROPBOX_TEST_DATA',
]);

export const { smugmugTestDataAction, dropboxTestDataAction } =
  createActions(dataActionsMap);
