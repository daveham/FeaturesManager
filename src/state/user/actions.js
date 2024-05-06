import { createActions } from 'redux-actions';

import { createActionMapForData } from '../utilities';

const dataActionsMap = createActionMapForData(['USER_DATA']);

export const { userDataAction } = createActions(dataActionsMap);
