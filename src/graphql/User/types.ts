import { objectType } from 'nexus';
import { resolve } from 'path/posix';

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
		t.nonNull.list.nonNull.field('upVotedMovieReviews', {
			type: 'MovieReview',
			resolve(parent, args, context, info) {
				return context.prisma.user
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.upVotes();
			},
		});
		t.nonNull.list.nonNull.field('downVotedMovieReviews', {
			type: 'MovieReview',
			resolve(parent, args, context, info) {
				return context.prisma.user
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.downVotes();
			},
		});
	},
});
