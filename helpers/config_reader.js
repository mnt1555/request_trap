
let fs=require('fs');
let data=fs.readFileSync('./config.json', 'utf8');
var parse_data=JSON.parse(data);

var get_mongo_data = function(item) {
	return parse_data['mongo_db'][item];
}


var get_connection_string =  function() {
	let mongoHost = get_mongo_data('host');
	let mongoPort = get_mongo_data('port');
	let mongoDb = get_mongo_data('db');
	return 'mongodb://' + mongoHost + ':' + mongoPort + '/' + mongoDb;
}

module.exports.get_connection_string = get_connection_string;
