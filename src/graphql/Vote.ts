import { enumType, extendType, nonNull, objectType, stringArg } from 'nexus';

export const Vote = objectType({
	name: 'Vote',
	definition(t) {
		t.nonNull.field('movieReview', { type: 'MovieReview' });
		t.nonNull.field('user', { type: 'User' });
	},
});

export const VoteMessage = objectType({
	name: 'VoteMessage',
	definition(t) {
		t.nullable.string('message');
		t.nonNull.field('vote', { type: 'Vote' });
	},
});

export const VoteMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.field('upVoteMovieReview', {
			type: 'Vote',
			args: {
				movieReviewId: nonNull(stringArg()),
			},
			async resolve(parent, args, context, info) {
				const { userId, prisma } = context;
				const { movieReviewId } = args;
				if (!!!userId) throw new Error('Cannot cast vote without logging in');

			},
		});
	},
});
