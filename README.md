hostsProxy
=======================

![hostsProxy logo](https://raw.github.com/yaniswang/hostsProxy/master/logo.png)

hostsProxy is a hosts proxy, used for auto test.

Your can run multi test job by different hosts file in one system.

Then, your 1 test node change to 4 or 8 nodes.

Features
=======================

1. Support http & https.
2. Support multi test job in one system.
3. Easy to use.

Install
=======================

1. Install Nodejs
    
    [http://nodejs.org/](http://nodejs.org/)

2. Install hostsproxy from npm

        npm install hostsproxy -g

Usage
=======================

1. Run with js

        var hostsproxy = require('hostsproxy');

        var proxy = hostsproxy.createServer({
            hosts: 'www.alibaba.com www.baidu.com'
        });

        proxy.on('ready', function(msg){
            console.log('ready', msg);
        });

        proxy.on('error', function(msg){
            console.log('error', msg);
        });

        proxy.on('close', function(){
            console.log('close');
        });

        proxy.setHosts('127.0.0.1 www.google.com');

        proxy.listen(1234, function(msg){
            console.log('ready', msg);
        });

2. Run with cli
    
    Place hosts file in current directory, file name is 'hosts'.

    Start proxy:

        hostsproxy start 1234

    Stop proxy:

        hostsproxy stop
    
    A port value of zero will assign a random port.

    Then you get the port number from the file: '.hostsproxy', like this:

        {"port":4492,"pid":13116}

License
================

hostsProxy is released under the MIT license:

> The MIT License
>
> Copyright (c) 2014 Yanis Wang \< yanis.wang@gmail.com \>
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.

Thanks
================

* GitHub: [https://github.com/](https://github.com/)