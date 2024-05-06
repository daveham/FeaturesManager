import { applyMiddleware, compose, legacy_createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import Reactotron from '../../ReactotronConfig';

import rootReducer from './reducers';

let sagaMiddleware;

export function runSagas(sagas) {
  sagaMiddleware?.run(sagas);
}

export default function createStore(_initialState) {
  if (__DEV__ && process.env.NODE_ENV !== 'test') {
    sagaMiddleware = createSagaMiddleware({
      sagaMonitor: Reactotron.createSagaMonitor(),
    });

    const enhancedMiddleware = compose(
      applyMiddleware(sagaMiddleware),
      Reactotron.createEnhancer(),
    );

    return legacy_createStore(rootReducer, enhancedMiddleware);
  } else {
    sagaMiddleware = createSagaMiddleware();

    return legacy_createStore(rootReducer, applyMiddleware(sagaMiddleware));
  }
}
