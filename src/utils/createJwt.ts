import { sign } from 'jsonwebtoken';

export const createJwt = (userId: string) => {
	return sign({ userId }, process.env.ACCESS_SECRET_TOKEN);
};
