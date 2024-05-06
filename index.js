import * as React from 'react';
import { AppRegistry, StatusBar /*, useColorScheme */ } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CombinedDefaultTheme as PaperTheme } from './theme';
import App from './src/App';
import createStore, { runSagas } from './src/state/configureStore';
import sagas from './src/sagas';
import { name as appName } from './app.json';
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
