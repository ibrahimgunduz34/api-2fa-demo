`use strict`;

module.exports = {
	authenticate: require('./authenticate'),
	register: require('./register'),
	enableTwoFactorAuthentication: require('./enable-tfa'),
	verifyTfaCode: require('./verify-tfa-code'),
};