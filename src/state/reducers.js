import { combineReducers } from 'redux';

import api from './api/reducers';
import ui from './ui/reducers';
import user from './user/reducers';

export default combineReducers({
  ui,
  user,
  api,
});
