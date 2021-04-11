'use strict';

const storage = require('../../storage');
const uuid = require('uuid');

exports.findOneByToken = (token) => {
	return storage.access_tokens.find(row => row.accessToken === token);
};

exports.create = (userId, ttl, accessType) => {
	const token = {
		userId: userId,
		accessToken: uuid.v4(),
		createdAt: Date.now(),
		ttl: ttl,
		accessType: accessType,
	};

	storage.access_tokens.push(token);

	return token;
};