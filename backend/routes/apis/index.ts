import { FastifyInstance } from 'fastify';
import { userPlugin } from './review.route';

export async function apiPlugin(app: FastifyInstance) {
    // Why use decorator: https://fastify.dev/docs/latest/Reference/Decorators/#decorators
    app.decorateRequest('user', null);

    app.register(userPlugin, { prefix: '/review' });
}
