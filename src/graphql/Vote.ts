import { enumType, objectType } from 'nexus';

export const VoteType = enumType({
	name: 'VoteType',
	members: ['UP_VOTE', 'DOWN_VOTE'],
});

export const Vote = objectType({
	name: 'Vote',
	definition(t) {
		t.nonNull.field('movieReview', { type: 'MovieReview' });
		t.nonNull.field('user', { type: 'User' });
		t.nonNull.field('voteType', { type: 'VoteType' });
	},
});
