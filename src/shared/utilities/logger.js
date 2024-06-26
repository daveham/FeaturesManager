import { consoleTransport, logger } from 'react-native-logs';

import reactotron from '../../../ReactotronConfig';

// The custom transport will use reactotron to log deep object graphs.
// Reactotron has a good UI for exploring these log messages.
// The console transport only logs a shallow object which is ok
// because deep object graphs flood the console and are too difficult
// to digest.
const customTransport = ({ rawMsg }) => {
  if (Array.isArray(rawMsg)) {
    reactotron.log(...rawMsg);
  } else {
    reactotron.log(rawMsg);
  }
};

const config = {
  transport: [consoleTransport, customTransport],
  severity: 'debug',
  transportOptions: {
    colors: {
      debug: 'greenBright',
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
};

export default logger.createLogger(config);
