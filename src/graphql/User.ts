import { extendType, objectType } from 'nexus';

export const User = objectType({
	name: 'User',
	definition(t) {
		t.nonNull.string('id');
		t.nonNull.string('name');
		t.nonNull.string('email');
		t.nonNull.list.nonNull.field('movieReviews', {
			type: 'MovieReview',
			resolve(parent, args, context, info) {
				return context.prisma.user
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.movieReviews();
			},
		});
	},
});

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
