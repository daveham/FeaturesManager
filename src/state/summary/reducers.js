import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import {
  isBackgroundDataRequest,
  isDataRequestAction,
  isDataResponseAction,
} from 'state/utilities';

import { summaryDataAction } from './actions';

const SUMMARY_INITIAL_STATE = {};

export const summary = handleActions(
  {
    [summaryDataAction]: (state, action) => {
      if (isDataResponseAction(action)) {
        return action.payload;
      }
      return state;
    },
  },
  SUMMARY_INITIAL_STATE,
);

export const summaryLoading = handleActions(
  {
    [summaryDataAction]: (state, action) => {
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
  summary,
  summaryLoading,
});
