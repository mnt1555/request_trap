const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

var TrapsModel = require('../models/trap_model').TrapsModel;


function add_data(req) {
	var trap = new TrapsModel({
		_id: new mongoose.Types.ObjectId(),
        trap_id: req.params.trap_id, 
        request_date: Date.now,
        remote_ip: req.ip,
		request_method: req.method,
  		query_string: req.query,
  		query_params: req.params,
  		cookies: req.cookies,
  		headers: req.headers
  		});

	trap.save(function (err) {
		let statusCode = 200;
        if (!err) {
            console.log("trap created");
            return {status: statusCode, request: trap};
        } else {
            console.log(err);
            if(err.name == 'ValidationError') {
            	statusCode = 400
                return {status: statusCode, error: err.name};
            } else {
            	statusCode = 500
                return {status: statusCode, error: 'Server error'};
            }
            console.log('Internal error(%d): %s', statusCode, err.message);
        }
    });		
}

// ============= Splash page with some instructions ====================================
router.get('/', (req, res) => {
	res.json({ response: 'a GET request for looking splash page with some instructions'});
});


// ============= Display requests here =================================================
router.get('/:trap_id/requests', (req, res) => {
	return TrapsModel.find(function (err, articles) {
        if (!err) {
            return res.send(articles);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});


// ============= Send requests to be captured here =====================================
router.post('/:trap_id', (req, res) => {
	res.json({response: 'a POST request for CREATING trap', body: add_data(req)});
});

router.put('/:trap_id', (req, res) => {
	res.json({response: 'a PUT request for EDITING trap}', body: add_data(req)});
});

router.delete('/:trap_id', (req, res) => {
	res.json({response: 'a DELETE request for DELETING trap', body: add_data(req)});
});

router.get('/:trap_id', (req, res) => {
	res.json({response: 'a GET request for GETTING trap', body: add_data(req)});
});


module.exports = router;
