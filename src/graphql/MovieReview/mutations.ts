import { extendType, intArg, nonNull, nullable, stringArg } from 'nexus';

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
						reviewedByUserId: userId,
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
						reviewedByUserId: userId,
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
