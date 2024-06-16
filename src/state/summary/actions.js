import { createActions } from 'redux-actions';

import { createActionMapForData } from '../utilities';

const dataActionsMap = createActionMapForData(['SUMMARY_DATA']);

export const { summaryDataAction } = createActions(dataActionsMap);
