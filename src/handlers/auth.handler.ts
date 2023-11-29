import { compare, hash } from 'bcrypt';
import { cookieOptions, DUPLICATED_EMAIL, LOGIN_FAIL, SALT_ROUNDS, USER_NOT_FOUND } from '@constants';
import jwt from 'jsonwebtoken';
import { envs, postgres } from '@configs';
import { AuthInputDto } from '@dtos/in';
import { AuthResultDto } from '@dtos/out';
import { Handler } from '@interfaces';
import { logger } from '@utils';

const login: Handler<AuthResultDto, { Body: AuthInputDto }> = async (req, res) => {
    const pool = postgres;
    const queryRes = await pool.query({
        text: 'SELECT id, email, password FROM users WHERE email = $1',
        values: [req.body.email],
    });
    const user = queryRes.rows[0];
    if (!user) return res.badRequest(USER_NOT_FOUND);

    const correctPassword = await compare(req.body.password, user.password);
    if (!correctPassword) return res.badRequest(LOGIN_FAIL);

    const userToken = jwt.sign({ userId: user.id }, envs.JWT_SECRET);
    res.setCookie('token', userToken, cookieOptions);

    return user;
};

const signup: Handler<AuthResultDto, { Body: AuthInputDto }> = async (req, res) => {
    const hashPassword = await hash(req.body.password, SALT_ROUNDS);
    const pool = postgres;
    let user: { id: number; email: string; password: string };
    try {
        const queryRes = await pool.query({
            text: 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            values: [req.body.email, hashPassword]
        });
        user = queryRes.rows[0];
    } catch (err) {
        logger.info(err);
        return res.badRequest(DUPLICATED_EMAIL);
    }

    const userToken = jwt.sign({ userId: user.id }, envs.JWT_SECRET);
    res.setCookie('token', userToken, cookieOptions);

    return {
        id: user.id,
        email: user.email
    };
};

export const authHandler = {
    login,
    signup
};
