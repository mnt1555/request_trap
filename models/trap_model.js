const mongoose = require('mongoose');

const TrapsSchema = new mongoose.Schema({
  trap_id: String,
  request_date: String,
  remote_ip: String,
  request_method: String,
  query_string: Array,
  query_params: Array,
  cookies: Object,
  headers: Object
});

TrapsModel = mongoose.model('Traps', TrapsSchema);
module.exports.TrapsModel = TrapsModel;
