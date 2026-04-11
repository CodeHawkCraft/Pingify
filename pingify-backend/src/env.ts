import dotenv from "dotenv";
dotenv.config();

function getEnv(key:string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const env = {
  DB_HOST: getEnv("DB_HOST"),
  DB_PORT: getEnv("DB_PORT"),
  DB_USER: getEnv("DB_USER"),
  DB_PASSWORD: getEnv("DB_PASSWORD"),
  DB_NAME: getEnv("DB_NAME"),
};

export default env;
