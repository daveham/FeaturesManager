import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import {
  isBackgroundDataRequest,
  isDataRequestAction,
  isDataResponseAction,
} from 'state/utilities';

import { exploreDataAction } from './actions';

const EXPLORE_INITIAL_STATE = {};

export const explore = handleActions(
  {
    [exploreDataAction]: (state, action) => {
      if (isDataResponseAction(action)) {
        return action.payload;
      }
      return state;
    },
  },
  EXPLORE_INITIAL_STATE,
);

export const exploreLoading = handleActions(
  {
    [exploreDataAction]: (state, action) => {
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
  explore,
  exploreLoading,
});
