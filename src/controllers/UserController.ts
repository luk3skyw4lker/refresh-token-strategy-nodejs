import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import knex from '../database/connection';

interface User {
	id?: string;
	username: string;
	hash: string;
	salt: string;
}

class UserController {
	async create(req: Request, res: Response) {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({ err: 'All fields required.' });
		}

		try {
			const salt = crypto.randomBytes(16).toString('hex');
			const hash = crypto
				.pbkdf2Sync(password, salt, 1000, 64, 'sha512')
				.toString('hex');

			const [user] = await knex
				.table<User>('users')
				.insert({
					hash,
					salt,
					username
				})
				.returning('*');

			return res.status(200).json(user);
		} catch (err) {
			const error = new Error(err);

			return res.status(500).json({ err: error.message });
		}
	}

	async login(req: Request, res: Response) {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({ err: 'All fields required.' });
		}

		try {
			const [user] = await knex
				.table<User>('users')
				.where('username', username);

			const hash = crypto
				.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512')
				.toString('hex');

			if (hash === user.hash) {
				const access_token = jwt.sign(
					{
						id: user.id,
						role: 'user'
					},
					'SECRET',
					{
						expiresIn: '24h'
					}
				);
				const refresh_token = jwt.sign(
					{
						id: user.id
					},
					'REFRESH_TOKEN_DIFF_SECRET'
				);

				const [act_token] = await knex
					.table('users_tokens')
					.where('user_id', user.id);

				if (act_token) {
					await knex
						.table('users_tokens')
						.update({ active_token: refresh_token })
						.where('user_id', user.id);
				} else {
					await knex.table('users_tokens').insert({
						user_id: user.id,
						active_token: refresh_token
					});
				}

				return res.status(200).json({ access_token, refresh_token });
			}

			return res.status(400).json({ err: 'Incorrect password.' });
		} catch (err) {
			const error = new Error(err);

			return res.status(500).json({ err: error.message });
		}
	}
}

export default new UserController();
