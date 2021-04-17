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

module.exports = {
  create,
};