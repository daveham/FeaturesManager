import { createActions } from 'redux-actions';

import { createActionMapForData } from '../utilities';

const dataActionsMap = createActionMapForData(['EXPLORE_DATA']);

export const { exploreDataAction } = createActions(dataActionsMap);
