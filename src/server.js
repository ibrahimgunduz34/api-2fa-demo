'use strict'

const app = require('./app');
const config = require('./config');

app.listen(config.SERVER_PORT, () => {
  console.log('The application started on TCP/' + config.SERVER_PORT);
});