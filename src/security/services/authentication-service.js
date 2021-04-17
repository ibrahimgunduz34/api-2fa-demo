`use strict`;

const { userRepository, accessTokenRespository } = require('./../repositories');
const config = require('../../config');
const { NoUserExistError, InvalidAccessTokenError } = require('../exceptions');
const cryptoService = require('./crypto-service');

// const ACCESS_TYPE_2FA = '2fa';
const ACCESS_TYPE_AUTHORIZED = 'authorized';

function authenticate(username, password) {
  const user = userRepository.findOneByName(username);

  if (!user) {
    throw new NoUserExistError('Invalid username or password.');
  }

  if (cryptoService.decrypt(config.SECRET_KEY, user.password) !== password ) {
    throw new NoUserExistError('Invalid username or password.');
  }

  // TODO: Check if the user is active
  // TODO: access_type to be replaced with ACCESS_TYPE_2FA after 2fa implementation
  return accessTokenRespository.create(user.id, config.LONG_LIFE_TOKEN_TTL, ACCESS_TYPE_AUTHORIZED);
}

function authenticateWithToken(token) {
  const accessToken = accessTokenRespository.findOneByToken(token);

  if (!accessToken) {
    throw new InvalidAccessTokenError('No token found.');
  }

  if (Date.now() - accessToken.createdAt >= accessToken.ttl) {
    throw new InvalidAccessTokenError('The token is not valid anymore');
  }

  // TODO: Check if the user is active

  return userRepository.findOneById(accessToken.userId);
}

module.exports = {
  authenticate,
  authenticateWithToken
};