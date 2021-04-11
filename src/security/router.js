'use strict';

const express = require('express');
const {authenticate, register} = require('./controllers');
const { Validator } = require('express-json-validator-middleware');
const { authenticateSchema, registerSchema } = require('./schemas');

const router = express.Router();
const { validate } = new Validator({ allErrors: true });

router.route('/authenticate').post(validate({body: authenticateSchema}), authenticate);
router.route('/register').post(validate({body: registerSchema}), register);

module.exports = router;