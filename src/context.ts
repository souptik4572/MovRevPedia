import { PrismaClient } from '@prisma/client';
import { decodeAuthHeader } from './utils/handleAuth';
import { Request } from 'express';

const prisma = new PrismaClient();

export interface Context {
	prisma: PrismaClient;
	userId?: string;
}

export const context = ({ req }: { req: Request }): Context => {
	const token =
		req && req.headers.authorization ? decodeAuthHeader(req.headers.authorization) : null;
	return {
		prisma,
		userId: token?.userId,
	};
};
