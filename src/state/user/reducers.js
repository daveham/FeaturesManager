import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import { isDataResponseAction } from '../utilities';
import { userDataAction } from './actions';

const INITIAL_STATE = {};

export const userData = handleActions(
  {
    [userDataAction]: (state, action) =>
      isDataResponseAction(action) ? action.payload : state,
  },
  INITIAL_STATE,
);

export default combineReducers({ userData });
