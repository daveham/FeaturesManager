// The babel plugin transform-inline-environment-variables will turn these
// environment variables into "compiled-in" constants.
// For dev mode, it is important to launch metro with these environment
// variables defined.
export const SMUGMUG_API_KEY = process.env.SMUGMUG_API_KEY;
export const SMUGMUG_NICKNAME = process.env.SMUGMUG_NICKNAME;
export const SMUGMUG_API_KEY_SECRET = process.env.SMUGMUG_API_KEY_SECRET;
export const SMUGMUG_ACCESS_TOKEN = process.env.SMUGMUG_ACCESS_TOKEN;
export const SMUGMUG_ACCESS_TOKEN_SECRET =
  process.env.SMUGMUG_ACCESS_TOKEN_SECRET;
