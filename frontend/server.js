const env = require('node-env-file');
env(__dirname + '/' + process.argv[2]);

var port = process.env.PORT;
var hostname = process.env.HOSTNAME;
var rootDir = process.env.ROOTDIR;

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));

app.use(express.static(path.join(__dirname,rootDir)));

app.use(history({
  disableDotRule: true,
  verbose: true
}));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + rootDir + '/index.html'));
});

const http = require('http').Server(app);

http.listen(port, hostname, () => {
  console.log('Listening @ ' + hostname + ':' + port);
});
