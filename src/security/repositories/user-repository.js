'use strict';

const storage = require('../../storage');
const uuid = require('uuid');

exports.findOneByUserCredentials = (username, password) => {
	return storage.users.find(row => row.username === username && row.password === password);
};

exports.findOneByName = (username) => {
	return storage.users.find(row => row.username === username);
};

exports.create = (username, password) => {
	const row = {id: uuid.v4(), username, password};
	storage.users.push(row);
	return row;
};

exports.findOneById = (userId) => {
	return storage.users.find(row => row.id === userId);
};