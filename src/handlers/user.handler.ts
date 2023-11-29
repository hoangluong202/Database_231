import { postgres } from '@configs';
import { USER_NOT_FOUND } from '@constants';
import { UserDto } from '@dtos/out';
import { Handler } from '@interfaces';

const getUserById: Handler<UserDto> = async (req, res) => {
    try {
        const userId = req.userId;
        const queryGetUserById = {
            text: 'SELECT * FROM users WHERE id = $1',
            values: [userId]
        };
        const pool = postgres;
        const user = await pool.query(queryGetUserById);
        return {
            id: user.rows[0].id,
            email: user.rows[0].email
        };
    } catch (error) {
        res.badRequest(USER_NOT_FOUND);
    }
};

export const usersHandler = {
    getUserById
};
