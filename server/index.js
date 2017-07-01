// Importing Node modules and initializing Express
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  router = require('./router'),
  mongoose = require('mongoose'),
  config = require('./config/main'),
  fs = require('fs'),
  https = require('https');

// Database Setupzz
mongoose.connect(config.database);
mongoose.Promise = require('q').Promise;

// Start the server
let server;
if (process.env.NODE_ENV != config.test_env) {
  var privateKey = fs.readFileSync('key.pem');
  var certificate = fs.readFileSync('cert.pem');
  var credential = { key: privateKey, cert: certificate };

  server = https.createServer(credential, app).listen(config.port);
  console.log(`Your server is running on port ${config.port}.`);
} else{
  server = app.listen(config.test_port);
  console.log(`Your server is running on port ${config.test_port}.`);
}

// Set static file location for production
// app.use(express.static(__dirname + '/public'));

// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Import routes to be served
router(app);

// necessary for testing
module.exports = server;
