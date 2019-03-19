var keys = [];
var values = [];
var myObj = {};

// function makeKey(key){
// 	keys.push(key[i]);
// }
// function makeValue(value){
// 	values.push(value[i]);
// }

function processFile(inputFile) {
	var fs = require('fs'),
		readline = require('readline'),
		instream = fs.createReadStream(inputFile),
		outstream = new (require('stream'))(),
		rl = readline.createInterface(instream, outstream);


	rl.on('line', function(line) {

		// datatyper
		var key;
		var value;

		if (line.startsWith("# Data type(PR);"))  {
			line = line.replace("# ", "");
			key = line.split(";");

			//populera arr
			key.forEach(function(element){
				keys.push(element);
				//console.log(element);	
			});

			// utläs arr
			for (var i = 0; i < keys.length; i++) {
				//console.log(keys[i]);
			}
		}

		// värden
		if (line.search("SE3;SEK;") > 0) {
			value = line.split(";");
			
			// populera arr
			value.forEach(function(element){
				values.push(element);
			});

			//utläs arr
			for (var i = 0; i < value.length; i++) {
				//console.log(value[i]);
			}
		}

		// for(i=0; i<values.length; i++){
		// 	var obj={};
		// 	for (j=0; j<keys.length; j++){
		// 		obj[keys[j]]=values[i][j];
		// 	 }
		// 	//myObj.push(obj);
		// 	console.log(obj);
		// }

		// values.forEach(r => {
		// 	let obj = {};
		// 	r.forEach((r, i) => {
		// obj[keys[i]] = r;
		// 	});
		// 	myObj.push(obj);
		// });
		// console.log(myObj);

		// skapa ny array
		// keys.forEach((key, i) => obj[key] = values[i]);
		// for (var i = 0; i < keys.length; i++) {
		// 	obj[keys[i]] = values[i];
		// }

		// for (var i = 0; i < keys.length; i++) {
		// 	console.log(keys[i]);
		// }
		//console.log(obj);
		//key.forEach(function(element){
		//	arr = 
		//});
		//console.log(value[0]);

		
		// for (var i = 0; i < keys.length; i++) {
		// 	console.log(keys[i] + ":" + i + "--" + values[i]);
		// }

		// if (line.startsWith("ST")) {
		// 	line = line.replace("ST;", "");
		// 	var timeMade = line.split(";");
		// 	console.log(timeMade);
		// }
		// if (line.search("SE3;SEK;") > 0) {
		// 	var timeCost = line.split(";");
		// 	console.log(timeCost);
		// }
		
	});






	rl.on('close', function (line) {
		//console.log(line);
		console.log('done reading file.');
	});
}



processFile('spotprice.sdv');
//console.log(keys);
for (var i = 0; i < keys.length; i++) {
	//console.log(keys[i]);
}

// const csvdata = require('csvdata');

// csvdata.load('spotprice.sdv', [
//     {
//         append: 'false',
//         delimiter: ';',
//         empty: false,
//         encoding: 'utf8',
//         header: false,
//         log: true
//       }    
// ]);



// var ftpClient = require('ftp-client'),
//     config = {
//         host: 'ftp.nordpoolspot.com',
//         port: 21,
//         user: 'spot',
//         password: 'spo1245t'
//     },
//     options = {
//         logging: 'basic'
//     },
//     client = new ftpClient(config, options);

// client.connect(function () {
//     console.log(`Connecting to: ${config.host}`);

//     client.download('./', './', {
//         overwrite: 'all'
//     }, function (result) {
//         console.log(result);
//     });

// });
