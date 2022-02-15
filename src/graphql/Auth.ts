import { extendType, nonNull, objectType, stringArg } from 'nexus';
import bcrypt from 'bcryptjs';
import { createJwt } from '../utils/createJwt';

export const AuthPayload = objectType({
	name: 'AuthPayload',
	definition(t) {
		t.nullable.string('message');
		t.nonNull.string('token');
		t.nonNull.field('user', {
			type: 'User',
		});
	},
});

export const AuthMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('registerUser', {
			type: 'AuthPayload',
			args: {
				name: nonNull(stringArg()),
				email: nonNull(stringArg()),
				password: nonNull(stringArg()),
			},
			async resolve(parent, args, context, info) {
				const { name, email, password } = args;
				const { prisma } = context;
				const doesEmailExist = await prisma.user.findUnique({
					where: {
						email,
					},
				});
				if (!!doesEmailExist) throw new Error('User with given email already exists');
				const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
				const user = await prisma.user.create({
					data: {
						name,
						email,
						password: hashedPassword,
					},
				});
				const token = createJwt(user.id);
				return {
					message: 'Succesfully registered new user',
					token,
					user,
				};
			},
		});
		t.nonNull.field('loginUser', {
			type: 'AuthPayload',
			args: {
				email: nonNull(stringArg()),
				password: nonNull(stringArg()),
			},
			async resolve(parent, args, context, info) {
				const { email, password } = args;
				const { prisma } = context;
				const user = await prisma.user.findUnique({
					where: {
						email,
					},
				});
				if (!!!user) throw new Error('User does not exist with the given email');
				const isPasswordCorrect = await bcrypt.compare(password, user.password);
				if (!isPasswordCorrect) throw new Error('Passwords are not matching');
				const token = createJwt(user.id);
				return {
					message: 'Succesfully logged in user',
					token,
					user,
				};
			},
		});
	},
});
