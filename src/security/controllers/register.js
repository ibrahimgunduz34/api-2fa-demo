`use strict`;

const HttpStatusCodes = require('http-status-codes');
const { userService } = require('../services');

module.exports = (req, res) => {
  const {username, password} = req.body;

  userService.createUser(username, password);

  res.status(HttpStatusCodes.OK)
    .json({success: true})
};