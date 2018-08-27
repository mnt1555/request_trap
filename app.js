const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const dotenv = require('dotenv');
const envConfig = dotenv.parse(fs.readFileSync('.example.env'));
const mongoose = require('mongoose');

const app = express();
const port = envConfig.port || 3000;

const server = require('http').Server(app);
const io = require('socket.io')(server);
const controller = require('./controllers/trapController.js');

app.set("view engine", "ejs");
app.get('/favicon.ico', (req, res) => res.status(204));
app.use(cookieParser());
app.use(bodyParser());
app.use('/:trapId/requests', controller.requests);
app.use('/:trapId', controller.traps);
app.use('/', controller.home);

const startServer = () => {
  server.listen(port, () => {
    console.log(`Web server listening on: ${port}`);
  });
}

const connectDb = () => {
  mongoose.connect(envConfig.mongoDb, {useNewUrlParser: true}).then(
    () => { startServer() },
    err => { console.log('connection error:', err.message); }
  );
}

connectDb();

socket_ = io.sockets.on('connection', (socket) => {
  return socket;
});

module.exports.socket_ = socket_;
