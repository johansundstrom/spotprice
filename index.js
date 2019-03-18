const csvdata = require('csvdata');

csvdata.load('spotprice.sdv', [
    {
        append: 'false',
        delimiter: ';',
        empty: false,
        encoding: 'utf8',
        header: false,
        log: true
      }    
]);



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
