import * as dotenv from 'dotenv';

dotenv.config();

interface EnvVars {
  PORT: string;
  DB_NAME: string;
  SECRET_WORD: string;
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASSWORD: string;
  NAME_APP: string;
  EMAIL_APP: string;
  EXPIRATION_TIME: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
}

export const envs: EnvVars = {
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  SECRET_WORD: process.env.SECRET_WORD,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  NAME_APP: process.env.NAME_APP,
  EMAIL_APP: process.env.EMAIL_APP,
  EXPIRATION_TIME: process.env.EXPIRATION_TIME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
};
