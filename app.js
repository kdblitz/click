var path = require('path');
var PORT = process.env.PORT || 8080;
var express = require('express');

var app = express();

app.use('/', express.static(path.join(__dirname)));

app.listen(PORT, function () {
  console.log('Server started')
});