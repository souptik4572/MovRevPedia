import { objectType } from 'nexus';

export const MovieReviewFeed = objectType({
	name: 'MovieReviewFeed',
	definition(t) {
		t.nullable.string('message');
		t.nonNull.int('reviewCount');
		t.nonNull.list.nonNull.field('movieReviews', {
			type: 'MovieReview',
		});
	},
});

export const MovieReviewResponseType = objectType({
	name: 'MovieReviewResponseType',
	definition(t) {
		t.nonNull.string('message');
		t.nonNull.field('movie', {
			type: 'MovieReview',
		});
	},
});

export const MovieReview = objectType({
	name: 'MovieReview',
	definition(t) {
		t.nonNull.string('id');
		t.nonNull.string('name');
		t.nonNull.string('review');
		t.nonNull.int('rating');
		t.field('reviewedBy', {
			type: 'User',
			resolve(parent, args, context, info) {
				return context.prisma.movieReview
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.reviewedBy();
			},
		});
		t.int('upVoteCount', {
			async resolve(parent, args, context, info) {
				return (
					await context.prisma.movieReview
						.findUnique({
							where: {
								id: parent.id,
							},
						})
						.upVoters()
				).length;
			},
		});
		t.int('downVoteCount', {
			async resolve(parent, args, context, info) {
				return (
					await context.prisma.movieReview
						.findUnique({
							where: {
								id: parent.id,
							},
						})
						.downVoters()
				).length;
			},
		});
	},
});
