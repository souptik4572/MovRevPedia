import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { decodeAuthHeader } from './utils/handleAuth';

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
