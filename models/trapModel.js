const mongoose = require('mongoose');

const trapsSchema = new mongoose.Schema({
  trapId: String,
  requestDate: String,
  remoteIp: String,
  requestMethod: String,
  queryString: Object,
  queryParams: Array,
  cookies: Object,
  headers: Object
});

trapsModel = mongoose.model('Traps', trapsSchema);
module.exports.trapsModel = trapsModel;
