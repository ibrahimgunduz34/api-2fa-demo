'use strict';

const express = require('express');
const controllers = require('./controllers');
const {dashboardController} = require('./controllers');

const router = express.Router();

router.route('/dashboard').get(dashboardController);

module.exports = router;