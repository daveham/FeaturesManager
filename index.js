import * as React from 'react';
import { AppRegistry, StatusBar /*, useColorScheme */ } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';

import 'react-native-gesture-handler';

import { name as appName } from './app.json';
import App from './src/App';
import sagas from './src/sagas';
import createStore, { runSagas } from './src/state/configureStore';
import { CombinedDefaultTheme as PaperTheme } from './theme';

import('./ReactotronConfig');

const store = createStore();
runSagas(sagas);

export default function Main() {
  // const isDarkMode = useColorScheme() === 'dark';
  // <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <PaperProvider theme={PaperTheme}>
          <StatusBar barStyle="dark-content" />
          <App />
        </PaperProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
