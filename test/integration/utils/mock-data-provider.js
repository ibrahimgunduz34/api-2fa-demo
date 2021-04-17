`use strict`;

const storage = require('../../../src/storage');
const sinon = require('sinon');
const uuid = require('uuid');

function createMockUserWithAccessToken(createdAt, ttl) {
  const accessToken = uuid.v4();
  const userId = uuid.v4();
  const username = `username-${uuid.v4()}`;

  sinon.stub(storage, 'users').value([
    {
      id: userId,
      username: username,
      password: 'WqfIWqQKVYXEwMTo8CbMygdh3gK0p5Sn6p+48JSeS6O1DNjK6xk=', // encrypted value of: mypassword
    }
  ]);

  sinon.stub(storage, 'access_tokens').value([
    {
      id: uuid.v4(),
      userId: userId,
      accessToken: accessToken,
      createdAt: createdAt,
      ttl: ttl,
    }
  ]);

  return { username, accessToken };
}

module.exports = {
  createMockUserWithAccessToken,
};