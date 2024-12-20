/**
 * Returns the value of a specified env variable key
 * @param {string} key The name of the env variable to retrieve
 * @param {string} defaultValue Default value (not the value from env variables)
 * @returns {string | undefined} Value of the env variables
 */
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const MONGO_URI = getEnv("MONGO_URI");
export const MONGO_URI_DEV = getEnv("MONGO_URI_DEV");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "3001");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const APP_ORIGIN_DEV = getEnv("APP_ORIGIN_DEV");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
export const DISCORD_CLIENT_ID = getEnv("DISCORD_CLIENT_ID");
export const DISCORD_CLIENT_SECRET = getEnv("DISCORD_CLIENT_SECRET");
export const DISCORD_CALLBACK_DEV = getEnv("DISCORD_CALLBACK_DEV");
export const GOOGLE_CLIENT_ID = getEnv("GOOGLE_CLIENT_ID");
export const GOOGLE_CLIENT_SECRET = getEnv("GOOGLE_CLIENT_SECRET");
export const GOOGLE_CALLBACK_DEV = getEnv("GOOGLE_CALLBACK_DEV");
export const FACEBOOK_CLIENT_ID = getEnv("FACEBOOK_CLIENT_ID");
export const FACEBOOK_CLIENT_SECRET = getEnv("FACEBOOK_CLIENT_SECRET");
export const FACEBOOK_CALLBACK_DEV = getEnv("FACEBOOK_CALLBACK_DEV");
export const GITHUB_CLIENT_ID = getEnv("GITHUB_CLIENT_ID");
export const GITHUB_CLIENT_SECRET = getEnv("GITHUB_CLIENT_SECRET");
export const GITHUB_CALLBACK_DEV = getEnv("GITHUB_CALLBACK_DEV");
