`use strict`;

const { UserAlreadyExistError } = require('../exceptions');
const userRepository = require('../repositories/user-repository');
const cryptoService = require('./crypto-service');
const config = require('../../config');

function createUser(username, password) {
  if (userRepository.findOneByName(username)) {
    throw new UserAlreadyExistError('The user already exists.')
  }

  const encryptedPassword = cryptoService.encrypt(config.SECRET_KEY, password);

  return userRepository.create(username, encryptedPassword);
}

module.exports = {
  createUser,
};