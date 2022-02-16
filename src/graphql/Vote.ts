import { extendType, nonNull, objectType, stringArg } from 'nexus';

export const Vote = objectType({
	name: 'Vote',
	definition(t) {
		t.nonNull.field('movieReview', { type: 'MovieReview' });
		t.nonNull.field('user', { type: 'User' });
	},
});

export const VoteResponseType = objectType({
	name: 'VoteResponseType',
	definition(t) {
		t.nullable.string('message');
		t.nonNull.field('movieReview', { type: 'MovieReview' });
		t.nullable.field('user', { type: 'User' });
	},
});

export const VoteMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('upVoteMovieReview', {
			type: 'VoteResponseType',
			args: {
				movieReviewId: nonNull(stringArg()),
			},
			async resolve(parent, args, context, info) {
				const { userId, prisma } = context;
				const { movieReviewId } = args;
				if (!!!userId) throw new Error('Cannot up vote a movie review without logging in');
				const upVoters = await prisma.movieReview
					.findUnique({
						where: {
							id: movieReviewId,
						},
					})
					.upVoters();
				const hasVoted = upVoters.findIndex((anUpVoter) => anUpVoter.id === userId) !== -1;
				let movieReview, message;
				if (hasVoted) {
					movieReview = await prisma.movieReview.update({
						where: {
							id: movieReviewId,
						},
						data: {
							upVoters: {
								disconnect: {
									id: userId,
								},
							},
						},
					});
					message = 'Successfully removed upvote from the movie review';
				} else {
					movieReview = await prisma.movieReview.update({
						where: {
							id: movieReviewId,
						},
						data: {
							upVoters: {
								connect: {
									id: userId,
								},
							},
						},
					});
					message = 'Successfully up voted movie review';
				}
				const user = await prisma.user.findUnique({ where: { id: userId } });
				return {
					message,
					movieReview,
					user,
				};
			},
		});
	},
});
