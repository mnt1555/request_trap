const trapsModel = require('../models/trapModel').trapsModel;
const fs = require('fs');
const dotenv = require('dotenv');
const envConfig = dotenv.parse(fs.readFileSync('.example.env'));
const scheme = envConfig.scheme;
const ip = require("ip");

module.exports = {
  home: (reg, res) => {
    res.render("index", {urlRequest: envConfig.urlRequest});
  },

  requests: ( { params: { trapId } }, res) => {
    return trapsModel.find({ trapId }).sort({ 'requestDate': -1 }).exec((err, traps) => {
      if (!err) {
        res.render("requests", {
        title: trapId,
        urlRequest: envConfig.urlRequest,
        traps: traps,
        scheme: envConfig.scheme
        });
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s', res.statusCode, err.message);
        return res.send( { error: 'Server error' } );
      }
    });
  },

  traps: (req, res) => {
    today = new Date();
    
    let remoteIp = (req.query['ip'] == undefined) ? req.body['ip']: req.query['ip'];
    const data = { 
      trapId: req.params.trapId, 
      requestDate: today.toLocaleString(),
      remoteIp: (remoteIp == undefined) ? ip.address(): remoteIp,
      requestMethod: req.method,
      queryString: req.query,
      queryParams: req.params,
      cookies: req.cookies,
      headers: req.headers,
      trapBody: req.body
    };
    const trap = new trapsModel(data);
    trap.save((err) => {
      if (!err) {
        console.log("trap created");
        const socket_ = require('../app.js').socket_;
        data['scheme'] = scheme;
        socket_.emit('update', data);
        res.statusCode = 200;
        data['status'] = "Success result";
      } else {
        console.log(err);
        res.statusCode = (err.name === 'ValidationError') ? 400 : 500;
        (res.statusCode === 400) ? data['status'] = "Validation Error" : data['status'] = "Server error";
      }
    res.render("trap", {scheme: scheme, status: res.statusCode, data: data});
    });
  }
}
