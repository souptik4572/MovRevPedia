import jwt from 'jsonwebtoken';

export interface AuthTokenPayload {
	userId: string;
}

export const decodeAuthHeader = (authHeader: string): AuthTokenPayload => {
	const token = authHeader.split(' ')[1];
	if (!!!token) throw new Error('No token found');
	return jwt.verify(token, process.env.ACCESS_SECRET_TOKEN) as AuthTokenPayload;
};

export const checkIsOnwer = (userId, commentedByUser) => {
	if(userId !== commentedByUser.id) throw new Error('Comment is not created by logged in user');
	return true;
}

// export const editOwnerType = (owner, userId) => {
// 	owner.update({
// 		where: {
// 			id: userId
// 		},
// 		data:
// 	})
// }
