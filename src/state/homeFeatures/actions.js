import { createActions } from 'redux-actions';

import { createActionMapForData } from '../utilities';

const dataActionsMap = createActionMapForData([
  'EXPLORE_DATA',
  'HOME_PAGE_DATA',
  'HOME_PAGE_FEATURES_DATA',
]);

export const {
  exploreDataAction,
  homePageDataAction,
  homePageFeaturesDataAction,
} = createActions(dataActionsMap);
