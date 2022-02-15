import { Secret } from 'jsonwebtoken';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_URL: string;
			PORT: number;
			BCRYPT_SALT: string;
			ACCESS_SECRET_TOKEN: Secret;
		}
	}
}

export {};
