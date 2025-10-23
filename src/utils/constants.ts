export const CONFIG = {
  APP: {
    NAME: 'Trip Pocket',
    VERSION: '1.0.0',
  },
  ENV: {
    IS_DEV: __DEV__,
    IS_PROD: !__DEV__,
  },
} as const;
