import { objectType } from 'nexus';

export const AuthPayload = objectType({
	name: 'AuthPayload',
	definition(t) {
		t.nullable.string('message');
		t.nonNull.string('token');
		t.nonNull.field('user', {
			type: 'User',
		});
	},
});
