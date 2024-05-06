import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import { openSnackbar, closeSnackbar } from './actions';

const INITIAL_SNACKBAR_TEXT_STATE = '';

export const snackbarText = handleActions(
  {
    [openSnackbar]: (_state, { payload }) => payload,
    [closeSnackbar]: _state => INITIAL_SNACKBAR_TEXT_STATE,
  },
  INITIAL_SNACKBAR_TEXT_STATE,
);

export const isSnackbarOpen = handleActions(
  {
    [openSnackbar]: _state => true,
    [closeSnackbar]: _state => false,
  },
  false,
);

export default combineReducers({ isSnackbarOpen, snackbarText });
