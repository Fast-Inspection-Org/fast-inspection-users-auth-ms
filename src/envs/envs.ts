import * as dotenv from 'dotenv';


dotenv.config();

interface EnvVars {
    PORT: string
    NAME_DB: string
    SECRET_WORD: string
}

export const envs: EnvVars = {
    PORT: process.env.PORT,
    NAME_DB: process.env.NAME_DB,
    SECRET_WORD: process.env.SECRET_WORD
}