'use strict'

const express = require('express');

const router = express.Router();

router.use('/security', require('./security/router'));
router.use('/admin', require('./admin/router'));

module.exports = router;