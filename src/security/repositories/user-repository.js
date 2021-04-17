'use strict';

const storage = require('../../storage');
const uuid = require('uuid');

function findOneByUserCredentials(username, password) {
	return storage.users.find(row => row.username === username && row.password === password);
}

function findOneByName(username) {
	return storage.users.find(row => row.username === username);
}

function create(username, password) {
	const row = {id: uuid.v4(), username, password};
	storage.users.push(row);
	return row;
}

function findOneById(userId) {
	return storage.users.find(row => row.id === userId);
}

module.exports = {
	findOneByUserCredentials,
	findOneByName,
	create,
	findOneById,
};