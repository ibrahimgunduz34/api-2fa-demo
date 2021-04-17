`use strict`;

const { userRepository, tfaSecretKeyRepository } = require('../repositories');
const { authenticator } = require('otplib');
const { TfaAlreadyEnabledError } = require('../exceptions');

function createTfaSecretKey(userId) {
  const user = userRepository.findOneById(userId);

  if (user.isTfaEnabled) {
    throw new TfaAlreadyEnabledError('Two factor authentication is already enabled for the user');
  }

  const userSecretKey = authenticator.generateSecret();

  tfaSecretKeyRepository.create(userId, userSecretKey);

  return userSecretKey;
}

module.exports = {
  createTfaSecretKey,
};