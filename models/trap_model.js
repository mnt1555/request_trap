const config_reader = require('../helpers/config_reader.js');
const mongoose = require('mongoose');

let connectionString = config_reader.get_connection_string();
console.log(connectionString);
mongoose.connect(connectionString);

var db = mongoose.connection;
db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});

var Schema = mongoose.Schema;

const TrapsSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
  	trap_id: String,
  	request_date: String,
  	remote_ip: String,
  	request_method: String,
  	query_string: Array,
  	query_params: Array,
  	cookies: Array,
  	headers: Array
  });

let TrapsModel = mongoose.model('Traps', TrapsSchema);

module.exports.TrapsModel = TrapsModel;
