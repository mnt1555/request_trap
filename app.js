const express = require('express');
const routes = require('./controllers/routes.js');
const cookieParser = require('cookie-parser');
require('dotenv').load();
const mongoose = require('mongoose');

const app = express();
const port = process.env.port || 3000;

app.get('/favicon.ico', (req, res) => res.status(204));
app.use(cookieParser());
app.use('/', routes);

const startServer = () => {
  app.listen(port, () => {
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
