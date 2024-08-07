import * as dotenv from 'dotenv';


dotenv.config();

interface EnvVars {
    PORT: string
    NAME_DB: string
}

export const envs: EnvVars = {
    PORT: process.env.PORT,
    NAME_DB: process.env.NAME_DB
}