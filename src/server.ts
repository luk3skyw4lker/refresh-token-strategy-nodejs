import express from 'express';
import jwt from 'express-jwt';
import { authRouter } from './routes/auth';

const app = express();
const auth_middleware = jwt({
	secret: 'SECRET',
	userProperty: 'payload',
	algorithms: ['HS256']
}).unless({ path: ['/login', '/users', '/refresh'] });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(auth_middleware);

app.use(authRouter);

export { app };
