var hostsproxy = require('../');
var fs = require('fs');

var port = process.argv[2] || 0;
var strHosts = '';
if(fs.existsSync('hosts')){
    strHosts = fs.readFileSync('hosts').toString();
    console.log('Hosts file loaded.')
}

var proxy = hostsproxy.createServer({
    hosts: strHosts
});

proxy.listen(port, function(msg){
    var port = msg.port;
    fs.writeFileSync('.hostsproxy', JSON.stringify({
        port: port,
        pid: process.pid
    }));
    console.log('Listening on port: ' + port);
});