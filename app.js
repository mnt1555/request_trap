const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').load();
const mongoose = require('mongoose');

const app = express();
const port = process.env.port || 3000;

const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./controllers/routes.js');

app.set("view engine", "ejs");
app.get('/favicon.ico', (req, res) => res.status(204));
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(cookieParser());
app.use('/', routes);

const startServer = () => {
  server.listen(port, () => {
    console.log(`Web server listening on: ${port}`);
  });
}

const connectDb = () => {
  mongoose.connect(process.env.mongoDb, {useNewUrlParser: true}).then(
    () => { startServer() },
    err => { console.log('connection error:', err.message); }
);
}

connectDb();

io.sockets.on('connection', function (socket) {
    console.log('A client is connected!');
});

