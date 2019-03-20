var keys = []; //skapa global arr av keys
var values = []; //skapa global arr av values
var myObj = {}; //skapa global objekt

processFile('spotprice.sdv');


// en callback function som exekveras asynkront
function processFile(inputFile) {
    console.log(`Öppnar: ${inputFile}`)

	var fs = require('fs'),
		readline = require('readline'),
		instream = fs.createReadStream(inputFile),
		outstream = new (require('stream'))(),
		rl = readline.createInterface(instream, outstream);


	rl.on('line', function(line) {

		// datatyper
        var key;
        var tempkeys = [];
		var value;

        // keys
		if (line.startsWith("# Data type(PR);"))  {
			line = line.replace("# ", "");
			key = line.split(";");
			//populera arr
			key.forEach(function(element){
				keys.push(element);
			});
		}

		// värden
		if (line.search("SE3;SEK;") > 0) {
            line = line.replace(",", ".");
			value = line.split(";");
			// populera arr
			value.forEach(function(element){
				values.push(element);
			});
		}
	});

	rl.on('close', function (line) {
        // slå ihop till objekt
        keys.forEach((key, i) => myObj[key] = values[i]);
        console.log(`Kl. 05:00: ${myObj.Hour5} ${myObj.Currency}`);
	});
}