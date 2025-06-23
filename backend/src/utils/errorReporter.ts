// Local-Volunteer-Finder/backend/utils/errorReporter.ts

export const reportErrorToExternalService = (error: {
  message: string;
  stack?: string;
  url?: string;
  method?: string;
}) => {
  // This simulates sending the error to Sentry, LogRocket, etc.
  console.log('[Stub External Reporter] Error reported:', {
    message: error.message,
    url: error.url,
    method: error.method
  });
};
