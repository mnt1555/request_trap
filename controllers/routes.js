const trapsModel = require('../models/trapModel').trapsModel;
const fs = require('fs');
const dotenv = require('dotenv');
const envConfig = dotenv.parse(fs.readFileSync('.example.env'));

module.exports = {
  home: (reg, res) => {
    //res.json({ response: 'a GET request for looking splash page with some instructions'});
    res.render("index", {});
  },

  requests: ( { params: { trapId } }, res) => {
    return trapsModel.find({ trapId }).sort({ 'requestDate': -1 }).exec((err, traps) => {
      if (!err) {
        res.render("requests", {
        title: trapId,
        urlRequest: envConfig.urlRequest,
        traps: traps
        });
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send( { error: 'Server error' } );
      }
    });
  },

  traps: (req, res) => {
    const data = { 
      trapId: req.params.trapId, 
      requestDate: Date.now(),
      remoteIp: req.ip,
      requestMethod: req.method,
      queryString: req.query,
      queryParams: req.params,
      cookies: req.cookies,
      headers: req.headers
    };
    const trap = new trapsModel(data);

    trap.save((err) => {
      if (!err) {
        console.log("trap created");
        const socket_ = require('../app.js').socket_;
        socket_.emit('update', data);
        return res.send({ status: 200, request: trap });
      } else {
        console.log(err);
        res.statusCode = (err.name === 'ValidationError') ? 400 : 500;
        return (res.statusCode === 400) ? res.status(400).json({ error: err.name }) : res.status(500).json({ error: 'Server error' });
      }
    });
  }
}
