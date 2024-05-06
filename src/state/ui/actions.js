import { createActions } from 'redux-actions';

import { identity } from '../utilities';

export const { openSnackbar, closeSnackbar } = createActions({
  OPEN_SNACKBAR: identity,
  CLOSE_SNACKBAR: identity,
});
