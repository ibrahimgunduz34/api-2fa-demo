`use strict`;

const storage = require('../../storage');
const uuid = require('uuid');

function create(userId, secretKey) {
  const row = {
    id: uuid.v4(),
    userId: userId,
    secretKey: secretKey,
    cancelled: 0,
  };

  storage.tfa_secret_keys.push(row);

  return row;
}

function findOneByUserId(userId) {
  return storage.tfa_secret_keys.find(row => row.userId === userId && row.cancelled === 0);
}

module.exports = {
  create,
  findOneByUserId,
};