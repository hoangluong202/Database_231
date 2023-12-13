import { FastifyError } from 'fastify';
import { PinoLoggerOptions } from 'fastify/types/logger';
import { envs } from '@be/configs';
import pino from 'pino';

const errorSerialize = (err: FastifyError) => {
    const isInternalServerError = !err.statusCode || err.statusCode === 500;
    return {
        type: err.name,
        stack: isInternalServerError && err.stack ? err.stack : 'null',
        message: err.message,
        statusCode: err.statusCode
    };
};

const fileLogTargets = ['info', 'warn', 'error', 'fatal'].map((logLevel) => ({
    target: 'pino/file',
    level: logLevel,
    options: {
        destination: process.cwd() + `/logs/${logLevel}.log`,
        mkdir: true
    }
}));
const pinoLogTarget = {
    target: 'pino-pretty',
    level: 'info',
    options: {
        translateTime: 'dd/mm/yy HH:MM:ss',
        ignore: 'pid,hostname'
    }
};

export const loggerConfig: Record<NodeEnv, PinoLoggerOptions> = {
    development: {
        transport: { targets: [pinoLogTarget] },
        serializers: { err: errorSerialize }
    },
    production: {
        transport: { targets: [...fileLogTargets] },
        serializers: { err: errorSerialize }
    },
    test: { serializers: { err: errorSerialize } }
};

export const logger = pino(loggerConfig[envs.NODE_ENV]);
