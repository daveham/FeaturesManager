import { createActions } from 'redux-actions';

import { createActionMapForData } from '../utilities';

const dataActionsMap = createActionMapForData([
  'EXPLORE_DATA',
  'HOME_PAGE_DATA',
  'HOME_PAGE_FEATURES_DATA',
]);

const identityActions = [
  'HOME_PAGE_DATA_PROGRESS_ACTION',
  'HOME_PAGE_FEATURES_DATA_PROGRESS_ACTION',
];

export const {
  // Data Actions
  exploreDataAction,
  homePageDataAction,
  homePageFeaturesDataAction,

  // Identity Actions
  homePageDataProgressAction,
  homePageFeaturesDataProgressAction,
} = createActions(dataActionsMap, ...identityActions);
