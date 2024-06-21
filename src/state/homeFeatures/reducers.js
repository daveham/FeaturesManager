import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import {
  isBackgroundDataRequest,
  isDataRequestAction,
  isDataResponseAction,
} from 'state/utilities';

import { homePageDataAction, homePageFeaturesDataAction } from './actions';

const HOME_PAGE_INITIAL_STATE = {};

export const homePageData = handleActions(
  {
    [homePageDataAction]: (state, action) => {
      if (isDataResponseAction(action)) {
        return action.payload;
      }
      return state;
    },
  },
  HOME_PAGE_INITIAL_STATE,
);

export const homePageDataLoading = handleActions(
  {
    [homePageDataAction]: (state, action) => {
      if (isDataRequestAction(action) && !isBackgroundDataRequest(action)) {
        return true;
      }
      if (isDataResponseAction(action)) {
        return false;
      }
      return state;
    },
  },
  false,
);

const HOME_PAGE_FEATURES_INITIAL_STATE = {};

export const homePageFeaturesData = handleActions(
  {
    [homePageFeaturesDataAction]: (state, action) => {
      if (isDataResponseAction(action)) {
        return action.payload;
      }
      return state;
    },
  },
  HOME_PAGE_FEATURES_INITIAL_STATE,
);

export const homePageFeaturesDataLoading = handleActions(
  {
    [homePageFeaturesDataAction]: (state, action) => {
      if (isDataRequestAction(action) && !isBackgroundDataRequest(action)) {
        return true;
      }
      if (isDataResponseAction(action)) {
        return false;
      }
      return state;
    },
  },
  false,
);

export default combineReducers({
  homePageData,
  homePageDataLoading,
  homePageFeaturesData,
  homePageFeaturesDataLoading,
});
