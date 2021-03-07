import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import knex from '../database/connection';

interface UsersTokens {
	active_token: string;
	user_id: number;
	id?: number;
}

interface RefreshToken {
	id: number;
}

class RefreshController {
	async refresh(req: Request, res: Response) {
		const { refresh } = req.headers;

		try {
			const { id } = jwt.verify(
				refresh as string,
				'REFRESH_TOKEN_DIFF_SECRET'
			) as RefreshToken;

			const [user] = await knex
				.table<UsersTokens>('users_tokens')
				.where('user_id', id)
				.limit(1);

			if (user.active_token === refresh) {
				const access_token = jwt.sign(
					{
						id: user.user_id,
						role: 'user'
					},
					'SECRET'
				);

				return res.status(200).json({ access_token });
			}

			return res.status(400).json({ err: 'Token expired' });
		} catch (err) {
			const error = new Error(err);

			return res.status(500).json({ err: error.message });
		}
	}
}

export default new RefreshController();
