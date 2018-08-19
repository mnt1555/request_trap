const express = require('express');
const router = express.Router();

const TrapsModel = require('../models/trap_model').TrapsModel;

router.get('/', (req, res) => {
  res.json({ response: 'a GET request for looking splash page with some instructions'});
});

router.get('/:trap_id/requests', ( { params: { trap_id } }, res) => {
  return TrapsModel.find({ trap_id }).sort({ 'request_date': -1 }).exec((err, traps) => {
  	  if (!err) {
       	return res.send(traps);
      } else {
       	res.statusCode = 500;
       	console.log('Internal error(%d): %s', res.statusCode, err.message);
       	return res.send( { error: 'Server error' } );
      }
    });
});

router.all('/:trap_id', (req, res) => {
  const trap = new TrapsModel({ 
  	trap_id: req.params.trap_id, 
    request_date: Date.now(),
    remote_ip: req.ip,
	request_method: req.method,
  	query_string: req.query,
  	query_params: req.params,
  	cookies: req.cookies,
  	headers: req.headers
  });

  trap.save((err) => {
    if (!err) {
      console.log("trap created");
      return res.send({ status: 200, request: trap });
    } else {
      console.log(err);
      res.statusCode = (err.name === 'ValidationError') ? 400 : 500;
      return (err.name === 'ValidationError') ? res.send({ status: 400, error: err.name }) : res.send({ status: 500, error: 'Server error' });
    }
  });
});

module.exports = router;
