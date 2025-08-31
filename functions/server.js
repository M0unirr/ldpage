// This file is a wrapper to run your existing server.js as a Netlify function.
const serverless = require('serverless-http');
const app = require('../server.js'); // Assuming your express app is exported from server.js

module.exports.handler = serverless(app);
