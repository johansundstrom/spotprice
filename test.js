var keys = []; //skapa global arr av myKeys
var readline = require('readline');
var fs = require('fs');

var myInterface = readline.createInterface({
  input: fs.createReadStream('spotprice.sdv')
});

var key;
myInterface.on('line', function (line) {
    if (line.startsWith("# Data type(PR);"))  {
        line = line.replace("# ", "");
        key = line.split(";");
        keys.push(key);
        //console.log('Line number ' + lineno + ': ' + line);
        for (var i = 0; i < keys.length; i++) {
            console.log(keys[i]);
        }
    }
});

