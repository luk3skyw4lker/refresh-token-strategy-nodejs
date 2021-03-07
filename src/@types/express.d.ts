interface UserToken {
	role: string;
	exp: number;
	iat: number;
	id: number;
}

declare global {
	namespace Express {
		interface Request {
			payload: UserToken;
		}
	}
}
