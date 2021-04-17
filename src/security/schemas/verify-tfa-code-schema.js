`use strict`;

module.exports = {
  type: 'object',
  required: ['code'],
  properties: {
    code: {
      type: 'string',
      maxLength: 6
    }
  }
};