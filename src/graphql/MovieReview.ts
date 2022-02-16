import { arg, extendType, intArg, nonNull, nullable, objectType, stringArg } from 'nexus';

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
		t.nonNull.list.nonNull.field('upVoters', {
			type: 'User',
			resolve(parent, args, context, info) {
				return context.prisma.movieReview
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.upVoters();
			},
		});
	},
});

export const MovieReviewQuery = extendType({
	type: 'Query',
	definition(t) {
		t.field('getAllMovieReviews', {
			type: 'MovieReviewFeed',
			async resolve(parent, args, context, info) {
				const { prisma } = context;
				const reviewCount = await prisma.movieReview.count();
				const movieReviews = await prisma.movieReview.findMany({});
				return {
					message: 'All of the movie reviews',
					reviewCount,
					movieReviews,
				};
			},
		});
	},
});

export const MovieReviewMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('createMovieReview', {
			type: 'MovieReviewResponseType',
			args: {
				name: nonNull(stringArg()),
				review: nonNull(stringArg()),
				rating: nonNull(intArg()),
			},
			async resolve(parent, args, context, info) {
				const { name, review, rating } = args;
				const { userId, prisma } = context;
				if (!!!userId) throw new Error('Cannot add movie review without logging in');
				const movie = await prisma.movieReview.create({
					data: {
						name,
						review,
						rating,
						reviewedBy: {
							connect: {
								id: userId,
							},
						},
					},
				});
				return {
					message: 'Successfully created new movie review',
					movie,
				};
			},
		});
		t.nonNull.field('editMovieReview', {
			type: 'MovieReviewResponseType',
			args: {
				id: nonNull(stringArg()),
				name: nullable(stringArg()),
				review: nullable(stringArg()),
				rating: nullable(intArg()),
			},
			async resolve(parent, args, context, info) {
				const { name, review, rating } = args;
				const { userId, prisma } = context;
				if (!!!userId) throw new Error('Cannot edit movie review without logging in');
				const isLoggedInUserOwner = await prisma.movieReview.findFirst({
					where: {
						userId,
					},
				});
				if (!!!isLoggedInUserOwner)
					throw new Error(
						'Cannot edit movie review as the review is not submitted by the logged in user'
					);
				let editedMovieReview = {};
				if (!!name && !!review && !!rating) editedMovieReview = { name, review, rating };
				else if (!!name && !!review) editedMovieReview = { name, review };
				else if (!!name && !!rating) editedMovieReview = { name, rating };
				else if (!!review && !!rating) editedMovieReview = { review, rating };
				else if (!!name) editedMovieReview = { name };
				else if (!!review) editedMovieReview = { review };
				else if (!!rating) editedMovieReview = { rating };
				const movie = await prisma.movieReview.update({
					where: {
						id: args.id,
					},
					data: {
						...editedMovieReview,
					},
				});
				return {
					message: 'Successfully edited movie review',
					movie,
				};
			},
		});
		t.nonNull.field('deleteMovieReview', {
			type: 'MovieReviewResponseType',
			args: {
				id: nonNull(stringArg()),
			},
			async resolve(parent, args, context, info) {
				const { userId, prisma } = context;
				if (!!!userId) throw new Error('Cannot delete movie review without logging in');
				const isLoggedInUserOwner = await prisma.movieReview.findFirst({
					where: {
						userId,
					},
				});
				if (!!!isLoggedInUserOwner)
					throw new Error(
						'Cannot delete movie review as the review is not submitted by the logged in user'
					);
				const movie = await prisma.movieReview.delete({
					where: {
						id: args.id,
					},
				});
				return {
					message: 'Successfully deleted movie review',
					movie,
				};
			},
		});
	},
});
