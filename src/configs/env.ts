import { config as configEnv } from 'dotenv';
import { str, cleanEnv } from 'envalid';

configEnv();

export const envs = cleanEnv(process.env, {
    NODE_ENV: str<NodeEnv>({
        devDefault: 'development',
        choices: ['development', 'test', 'production']
    }),
    JWT_SECRET: str(),
    COOKIE_SECRET: str(),
    CORS_WHITE_LIST: str(),
    DISCORD_WEBHOOK_URL: str(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_HOST: str(),
    POSTGRES_PORT: str(),
    POSTGRES_DB: str(),
});

export const CORS_WHITE_LIST = envs.CORS_WHITE_LIST.split(',');
