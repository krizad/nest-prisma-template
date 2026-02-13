export const appConstants = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  IS_PUBLIC_KEY: 'isPublic',
  TIME: {
    MINUTES: 60 * 1000,
    HOURS: 60 * 60 * 1000,
    DAYS: 24 * 60 * 60 * 1000,
  },
  SEARCH_DATE: {
    DEFAULT_DAYS: 7,
    DEFAULT_WARNING_DAYS: 3,
  },
} as const;
