import { combineReducers } from 'redux';

import ui from './ui/reducers';
import user from './user/reducers';
import api from './api/reducers';

export default combineReducers({
  ui,
  user,
  api,
});
