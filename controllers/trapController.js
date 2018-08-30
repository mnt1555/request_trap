const trapsModel = require('../models/trapModel').trapsModel;
const envConfig = require('dotenv').load();
const ip = require("ip");
const urlRequest = envConfig.urlRequest || "http://localhost:3000/";

module.exports = {
  home: (reg, res) => {
    res.render("index", {urlRequest});
  },

  requests: ( { params: { trapId } }, res) => {
    return trapsModel.find({ trapId }).sort({ 'requestDate': -1 }).exec((err, traps) => {
      if (!err) {
        res.render("requests", { title: trapId, urlRequest, traps });
      } else {
        res.statusCode = 500;
        console.log(`Internal error (${res.statusCode}): ${err.message}`);
        return res.send( { error: 'Server error' } );
      }
    });
  },

  traps: (req, res) => {
    today = new Date();
    
    const remoteIp = req.query['ip'] || req.body['ip'];
    const data = { 
      trapId: req.params.trapId, 
      requestDate: today.toLocaleString(),
      remoteIp: remoteIp || ip.address(),
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
        req.io.emit('update', data);
        data['status'] = "Success result";
      } else {
          data['status'] = err.name;
      }
    res.render("trap", {data});
    });
  }
}
