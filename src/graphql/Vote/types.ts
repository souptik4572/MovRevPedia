import { objectType } from 'nexus';

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
