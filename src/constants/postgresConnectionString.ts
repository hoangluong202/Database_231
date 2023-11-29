import { envs } from '@configs';

export const connectionString = `postgresql://${envs.POSTGRES_USER}:${envs.POSTGRES_PASSWORD}@${envs.POSTGRES_HOST}:${envs.POSTGRES_PORT}/${envs.POSTGRES_DB}`