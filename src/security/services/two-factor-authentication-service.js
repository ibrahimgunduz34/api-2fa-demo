`use strict`;

const { userRepository, tfaSecretKeyRepository, accessTokenRespository } = require('../repositories');
const { authenticator } = require('otplib');
const { TfaAlreadyEnabledError, TfaCodeVerificationError } = require('../exceptions');
const config = require('../../config');
const { ACCESS_TYPE_AUTHORIZED } = require('../../security/access-type');

function createTfaSecretKey(userId) {
  const user = userRepository.findOneById(userId);

  if (user.isTfaEnabled) {
    throw new TfaAlreadyEnabledError('Two factor authentication is already enabled for the user');
  }

  const userSecretKey = authenticator.generateSecret();

  // TODO: As the in memory storage returns a reference, any change on the object would be reflected directly.
  // TODO: Use a library or implement proper in-memory persistence layer.
  user.isTfaEnabled = true;

  // TODO: update the user profile and store the key in a one single transaction.
  tfaSecretKeyRepository.create(userId, userSecretKey);

  return userSecretKey;
}

function verifyTfaCode(userId, tfaToken) {
  const user = userRepository.findOneById(userId);

  if (!user.isTfaEnabled) {
    throw new TfaCodeVerificationError('Two factor authentication is not enabled for the user.');
  }

  const userSecret = tfaSecretKeyRepository.findOneByUserId(userId);
  if (!userSecret) {
    throw new TfaCodeVerificationError('Your TFA has been disabled. Please contact the administrator');
  }

  if (!authenticator.verify({token: tfaToken, secret: userSecret.secretKey})) {
    throw new TfaCodeVerificationError('Invalid verification code');
  }

  return accessTokenRespository.create(userId, config.LONG_LIFE_TOKEN_TTL, ACCESS_TYPE_AUTHORIZED);
}

module.exports = {
  createTfaSecretKey,
  verifyTfaCode,
};