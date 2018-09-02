const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const envConfig = require('dotenv').load();
const mongoose = require('mongoose');
const routes = require('./routes/trapRoutes.js');

const app = require('express')();
const port = envConfig.port || 3000;
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set("view engine", "ejs");
app.get('/favicon.ico', (req, res) => res.status(204));
app.use(cookieParser());
app.use(bodyParser());

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/', routes);

const startServer = async () => {
  await server.listen(port, () => {
    console.log(`Web server listening on: ${port}`);
  });
}

const connectDb = async () => {
  try {
    await mongoose.connect(envConfig.mongoDb || "mongodb://127.0.0.1:27017/trap", 
      {useNewUrlParser: true});
    await startServer();
  } catch (err){
    console.log('connection error:', err.message);
    process.exit(err.statusCode);
  }
}

connectDb();
