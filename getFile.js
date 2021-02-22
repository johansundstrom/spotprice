var ftpClient = require('ftp-client'),
    config = {
        host: '*',
        port: *,
        user: '*',
        password: '*'
    },
    options = {
        logging: 'basic'
    },
    client = new ftpClient(config, options);

client.connect(function () {
    console.log(`Connecting to: ${config.host}`);

    client.download('./', './', {
        overwrite: 'all'
    }, function (result) {
        console.log(result);
    });

});
