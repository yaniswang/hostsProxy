var net = require('net');
var http = require('http');
var url = require('url');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var utils = require('./utils');
var extend =utils.extend;
var shExpMatch = utils.shExpMatch;

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ', err);
});

var defaultConfig = {
    hosts: ''
};

var HostsProxyServer = function(){
    var self = this;
    return self._init.apply(self, arguments);
}
util.inherits(HostsProxyServer, EventEmitter);

var HostsProxyServerPrototype = HostsProxyServer.prototype;

HostsProxyServerPrototype._init = function(config){
    var self = this;
    var config = extend({}, defaultConfig, config);

    self.setHosts(config.hosts);

    self._Server = null;
};

// update hosts
HostsProxyServerPrototype.setHosts = function(strHosts){
    var self = this;
    var mapHosts = {};
    var arrLines = strHosts.split(/\r?\n/);
    arrLines.forEach(function(line){
        var match = line.match(/^\s*([^\s#]+)\s+([^#]+)/);
        if(match){
            match[2].trim().split(/\s+/).forEach(function(domain){
                domain = domain.toLowerCase();
                if(mapHosts[domain] === undefined){
                    mapHosts[domain] = match[1];
                }
            });
        }
    });
    self._mapHosts = mapHosts;
};

// get new hostname
HostsProxyServerPrototype._getNewHostname = function(hostname){
    var self = this;
    var mapHosts = self._mapHosts;
    for(var domain in mapHosts){
        if(shExpMatch(hostname, domain)){
            return mapHosts[domain];
        }
    }
    return hostname;
}

// start proxy server
HostsProxyServerPrototype.listen = function(port, callback){
    var self = this;
    self.port = port;

    if(callback !== undefined){
        self.on('ready', callback);
    }

    // create http proxy
    var server = self._server = http.createServer(function (clientRequest, clientResponse) {
        var urlInfo = url.parse(clientRequest.url);
        var userIp = clientRequest.connection.remoteAddress || 
            clientRequest.socket.remoteAddress ||
            clientRequest.connection.socket.remoteAddress;
        clientRequest.headers['X-Forwarded-For'] = userIp;
        var reqOptions = {
            hostname: self._getNewHostname(urlInfo.hostname),
            port: urlInfo.port || 80,
            method: clientRequest.method,
            path: urlInfo.path,
            headers: clientRequest.headers,
            agent: false
        }
        var remoteServer = http.request(reqOptions, function (remoteResponse) {
            clientResponse.writeHead(remoteResponse.statusCode, remoteResponse.headers);
            remoteResponse.pipe(clientResponse);
        });
        remoteServer.on('error', function (err) {
            clientResponse.end();
            self.emit('error', err);
        });
        clientRequest.pipe(remoteServer);
    });
    // create https proxy
    server.on('connect', function (httpRequest, reqSocket) {
        var urlInfo = url.parse('http://' + httpRequest.url);
        var remoteSocket = net.connect(urlInfo.port, self._getNewHostname(urlInfo.hostname), function () {
            reqSocket.write("HTTP/1.1 200 Connection established\r\n\r\n");
            remoteSocket.pipe(reqSocket).pipe(remoteSocket);
        });
        remoteSocket.on('error', function (err) {
            reqSocket.end();
            self.emit('error', err);
        });
    });
    server.on('error', function(err){
        self.emit('error', err);
    });
    server.listen(self.port, function() { 
        self.emit('ready', {
            port: server.address().port
        });
    });
};

// close proxy
HostsProxyServerPrototype.close = function(){
    var self = this;
    var server = self._server;
    if(server !== null){
        server.close();
        self._server = null;
        self.emit('close');
    }
};

var hostsproxy = {
    Server: HostsProxyServer,
    createServer: function(config){
        return new HostsProxyServer(config);
    }
};

module.exports = hostsproxy;