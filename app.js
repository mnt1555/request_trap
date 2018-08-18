"use strict";
const express = require('express');
const routes = require('./controllers/routes.js');
var cookieParser = require('cookie-parser');

const app = express();
const port = process.env.port || 2715;

app.use( function(req, res, next) {
	if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
		return res.sendStatus(204);
	}
  return next();
});

app.use(cookieParser());
app.use('/', routes);

// =========== Errors =======================
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});
// =========== End Errors ===================


app.listen(port, () => {
  console.log(`Web server listening on: ${port}`);
});
