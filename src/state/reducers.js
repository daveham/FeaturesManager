import { combineReducers } from 'redux';

import api from './api/reducers';
import summary from './summary/reducers';
import ui from './ui/reducers';
import user from './user/reducers';

export default combineReducers({
  api,
  summary,
  ui,
  user,
});
