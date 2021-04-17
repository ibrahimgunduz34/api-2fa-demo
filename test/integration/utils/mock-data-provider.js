`use strict`;

const storage = require('../../../src/storage');
const sinon = require('sinon');
const uuid = require('uuid');

const DEFAULT_TTL = 30000;

module.exports = class MockDataProvider {
  static createMockUser() {
    const userId = uuid.v4();
    const username = `username-${uuid.v4()}`;

    sinon.stub(storage, 'users').value([
      {
        id: userId,
        username: username,
        password: 'WqfIWqQKVYXEwMTo8CbMygdh3gK0p5Sn6p+48JSeS6O1DNjK6xk=', // encrypted value of: mypassword
        isTfaEnabled: false,
      }
    ]);

    return { userId, username };
  }

  static createAccessToken(userId, createdAt, ttl, accessType) {
    const accessToken = uuid.v4();

    sinon.stub(storage, 'access_tokens').value([
      {
        id: uuid.v4(),
        userId: userId,
        accessToken: accessToken,
        createdAt: createdAt,
        ttl: ttl,
        accessType: accessType,
      }
    ]);

    return { accessToken }
  }

  static createTfaSecretKey(userId) {
    const secretKey = 'IFJUIRSHIFJUIRSHIFJUIRSHIFJUIRSH';
    sinon.stub(storage, 'tfa_secret_keys').value([
      {
        id: uuid.v4(),
        userId: userId,
        secretKey: secretKey,
        cancelled: 0,
      }
    ]);

    return secretKey;
  }

  static createMockUserWithAccessToken(createdAt, ttl, accessType) {
    const user = MockDataProvider.createMockUser();
    const accessToken = MockDataProvider.createAccessToken(user.userId, createdAt, ttl, accessType);
    return { ...user, ...accessToken };
  }

  static createMockUserThatTfaEnabled(accessType) {
    const user = MockDataProvider.createMockUserWithAccessToken(Date.now(), DEFAULT_TTL, accessType);

    const secretKey = MockDataProvider.createTfaSecretKey(user.userId);

    storage.users[0].isTfaEnabled = true;

    return { ...user, secretKey };
  }
};