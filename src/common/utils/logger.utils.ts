import { ELogLevel } from '../constants/logger.constants';

export const getLogLevels = () => {
  const minLogLevelValue = ELogLevel[process.env.LOG_LEVEL];

  const logLevels = [];
  for (const [logLevel, value] of Object.entries(ELogLevel)) {
    if (value >= minLogLevelValue) {
      logLevels.push(logLevel);
    }
  }

  return logLevels;
};

export default {
  getLogLevels,
};
