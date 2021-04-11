'use strict';

const express = require('express');
const BodyParser = require('body-parser');
const ErrorMiddleware = require('./common/middlewares/error-middleware');
const router = require('./router');
const { accessControlMiddleware } = require('./security/middlewares');

const app = express();

// Middleware Setup
app.use(BodyParser.json());
app.use(accessControlMiddleware);

// Controller Setup
app.use('/v1', router);

app.use(ErrorMiddleware);



module.exports = app;
