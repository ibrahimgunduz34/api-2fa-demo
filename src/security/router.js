'use strict';

const express = require('express');
const { authenticate, register, enableTwoFactorAuthentication, verifyTfaCode } = require('./controllers');
const { Validator } = require('express-json-validator-middleware');
const { authenticateSchema, registerSchema, verifyTfaCodeSchema } = require('./schemas');

const router = express.Router();
const { validate } = new Validator({ allErrors: true });

router.route('/authenticate').post(validate({body: authenticateSchema}), authenticate);
router.route('/register').post(validate({body: registerSchema}), register);
router.route('/enable-tfa').post(enableTwoFactorAuthentication);
router.route('/verify-tfa-code').post(validate({body: verifyTfaCodeSchema}), verifyTfaCode);

module.exports = router;