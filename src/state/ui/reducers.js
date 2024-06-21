import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import { closeSnackbar, openSnackbar } from './actions';

const INITIAL_SNACKBAR_CONTENT_STATE = { text: '', error: false };

export const snackbarContent = handleActions(
  {
    [openSnackbar]: (_state, { payload }) => payload,
    [closeSnackbar]: _state => INITIAL_SNACKBAR_CONTENT_STATE,
  },
  INITIAL_SNACKBAR_CONTENT_STATE,
);

export const isSnackbarOpen = handleActions(
  {
    [openSnackbar]: _state => true,
    [closeSnackbar]: _state => false,
  },
  false,
);

export default combineReducers({ isSnackbarOpen, snackbarContent });
