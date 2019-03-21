var keys = []; //skapa global arr av keys
var values = []; //skapa global arr av values
var myObj = {}; //skapa global objekt
var timeMade = []; //fil skapades

processFile('spotprice.sdv');


// en callback function som exekveras asynkront
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

        // tid
		if (line.startsWith("ST;"))  {
			line = line.replace("ST;", "");
			time = line.split(";");
			//populera arr
			//console.log(time);
			time.forEach(function(element){
				timeMade.push(element);
			});
		}

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
		
		// skriv ut nåt
		console.log("\x1b[33m%s\x1b[0m", `\r\nÖppnar: ${inputFile} från ${timeMade[0]} - ${timeMade[1]}`)
        console.log(`\r\nKl. 05:00: ${myObj.Hour5} ${myObj.Currency}`);
	});
}