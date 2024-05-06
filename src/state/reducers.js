import { combineReducers } from 'redux';

import ui from './ui/reducers';
import user from './user/reducers';

export default combineReducers({
  ui,
  user,
});
