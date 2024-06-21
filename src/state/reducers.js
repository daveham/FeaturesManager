import { combineReducers } from 'redux';

import api from './api/reducers';
import explore from './explore/reducers';
import homeFeatures from './homeFeatures/reducers';
import summary from './summary/reducers';
import ui from './ui/reducers';
import user from './user/reducers';

export default combineReducers({
  api,
  explore,
  homeFeatures,
  summary,
  ui,
  user,
});
