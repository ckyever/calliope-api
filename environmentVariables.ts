const getEnvironmentVariable = (name: string): string => {
  const variable = process.env[name];
  if (!variable) {
    throw Error(`Missing environment variable for ${name}`);
  }
  return variable;
};

const variables = {
  DATABASE_URL: getEnvironmentVariable("DATABASE_URL"),
  PORT: getEnvironmentVariable("PORT"),
  SESSION_SECRET: getEnvironmentVariable("SESSION_SECRET"),
  SPOTIFY_CLIENT_ID: getEnvironmentVariable("SPOTIFY_CLIENT_ID"),
  SPOTIFY_SECRET: getEnvironmentVariable("SPOTIFY_SECRET"),
  SPOTIFY_CALLBACK_URL: getEnvironmentVariable("SPOTIFY_CALLBACK_URL"),
  FRONTEND_REDIRECT_URL: getEnvironmentVariable("FRONTEND_REDIRECT_URL"),
};

export default variables;
