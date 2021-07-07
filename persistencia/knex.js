const options = require('../config/database');
const knex = require('knex')(options);

module.exports = knex;