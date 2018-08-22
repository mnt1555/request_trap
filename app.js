const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const dotenv = require('dotenv');
const envConfig = dotenv.parse(fs.readFileSync('.example.env'));
const mongoose = require('mongoose');

const app = express();
const port = envConfig.port || 3000;

const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./controllers/routes.js');

app.set("view engine", "ejs");
app.get('/favicon.ico', (req, res) => res.status(204));
app.use(cookieParser());
app.use('/:trapId/requests', routes.requests);
app.use('/:trapId', routes.traps);
app.use('/', routes.home);

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
