import { extendType } from 'nexus';

export const UserQuery = extendType({
	type: 'Query',
	definition(t) {
		t.field('getUserProfile', {
			type: 'User',
			async resolve(parent, args, context, info) {
				const { userId, prisma } = context;
				if (!!!userId) throw new Error('Cannot fetch user profile without loggin in');
				return prisma.user.findUnique({
					where: {
						id: userId,
					},
				});
			},
		});
	},
});
