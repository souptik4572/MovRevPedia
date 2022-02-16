import { extendType, nonNull, stringArg } from 'nexus';

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
				const { reviewedByUserId, upVoters } = (await prisma.movieReview.findUnique({
					where: {
						id: movieReviewId,
					},
					select: {
						reviewedByUserId: true,
						upVoters: true,
					},
				})) as any;
				if (reviewedByUserId === userId)
					throw new Error('Someone cannot vote their own movie review');
				const hasVoted =
					upVoters.findIndex((anUpVoter: any) => anUpVoter.id === userId) !== -1;
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
		t.nonNull.field('downVoteMovieReview', {
			type: 'VoteResponseType',
			args: {
				movieReviewId: nonNull(stringArg()),
			},
			async resolve(parent, args, context, info) {
				const { userId, prisma } = context;
				const { movieReviewId } = args;
				if (!!!userId)
					throw new Error('Cannot down vote a movie review without logging in');
				const { reviewedByUserId, downVoters } = (await prisma.movieReview.findUnique({
					where: {
						id: movieReviewId,
					},
					select: {
						reviewedByUserId: true,
						downVoters: true,
					},
				})) as any;
				if (reviewedByUserId === userId)
					throw new Error('Someone cannot vote their own movie review');
				const hasVoted =
					downVoters.findIndex((anDownVoter: any) => anDownVoter.id === userId) !== -1;
				let movieReview, message;
				if (hasVoted) {
					movieReview = await prisma.movieReview.update({
						where: {
							id: movieReviewId,
						},
						data: {
							downVoters: {
								disconnect: {
									id: userId,
								},
							},
						},
					});
					message = 'Successfully removed downvote from the movie review';
				} else {
					movieReview = await prisma.movieReview.update({
						where: {
							id: movieReviewId,
						},
						data: {
							downVoters: {
								connect: {
									id: userId,
								},
							},
						},
					});
					message = 'Successfully down voted movie review';
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
