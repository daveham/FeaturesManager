import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import { userDataAction } from './actions';
import { isDataResponseAction } from '../utilities';

const INITIAL_STATE = {};

export const userData = handleActions(
  {
    [userDataAction]: (state, action) =>
      isDataResponseAction(action) ? action.payload : state,
  },
  INITIAL_STATE,
);

export default combineReducers({ userData });
