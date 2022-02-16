import { extendType } from 'nexus';

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
