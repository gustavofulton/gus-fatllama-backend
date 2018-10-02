// app.js
var express = require('express')
var app = express()

require('./routes')(app);

// Start the server on port 3000
app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');
