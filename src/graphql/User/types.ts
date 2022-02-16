import { objectType } from 'nexus';

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
