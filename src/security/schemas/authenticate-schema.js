`use strict`;

module.exports = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: {
      type: 'string',
      maxLength: 50
    },
    password: {
      type: 'string',
      maxLength: 50,
      minLength: 9,
    }
  }
};