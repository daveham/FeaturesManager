import { reactotronRedux } from 'reactotron-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron, { networking } from 'reactotron-react-native';
import sagaPlugin from 'reactotron-redux-saga';

let reactotron;

if (__DEV__ && process.env.NODE_ENV !== 'test') {
  reactotron = Reactotron.configure({
    name: 'FeaturesManager',
    onConnect: () => Reactotron.clear(),
  })
    .setAsyncStorageHandler(AsyncStorage)
    .useReactNative()
    .use(reactotronRedux())
    .use(networking())
    .use(sagaPlugin());

  reactotron.onCustomCommand({
    title: 'ShowAsyncStorage',
    description: 'Show values in Async Storage',
    command: 'dumpAsyncStorage',
    handler: () => {
      AsyncStorage.getAllKeys().then(keys => {
        AsyncStorage.multiGet(keys).then(data => {
          data.forEach((kvPair, index) => {
            Reactotron.log(
              `AsyncStorage[${index}] = ${kvPair[0]}: ${kvPair[1]}`,
            );
          });
        });
      });
    },
  });

  reactotron.connect();
}

export default reactotron;
