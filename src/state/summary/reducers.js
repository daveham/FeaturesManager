import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import { smugmugTestRequestAction } from 'state/api/actions';
import { isDataRequestAction, isDataResponseAction } from 'state/utilities';

const SUMMARY_INITIAL_STATE = {};

export const summary = handleActions(
  {
    [smugmugTestRequestAction]: (state, action) => {
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
    [smugmugTestRequestAction]: (state, action) => {
      if (isDataRequestAction(action)) {
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
