//phantomjs --disk-cache=yes --ignore-ssl-errors=true --local-to-remote-url-access=true seoServer.js
//FIXME seoServer es inestable se cuelga con muchas peticiones y error de codificacion

var system = require('system');
var fs = require('fs');
//var NodeCache = require('node-cache');
//var cache = new NodeCache();

var urlapi = require('url');

if (system.args.length < 1) {
    console.log('Missing arguments.');
    phantom.exit();
}

var server = require('webserver').create();
var port = 4000;
var urlPrefix = '';


var renderHtml = function (url, cb) {

    var time = Date.now();

    var page = require('webpage').create();
    page.settings.loadImages = false;
    page.settings.diskCache = true;
    page.settings.localToRemoteUrlAccessEnabled = true;
    page.onCallback = function () {
        console.log('Eval time ' + (Date.now() - time) + ' msec');
        cb(page.content);
        page.close();

    };
    page.onConsoleMessage = function (msg, lineNum, sourceId) {
        console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
    };
    page.onInitialized = function () {
        page.evaluate(function () {
            setTimeout(function () {
                window.callPhantom();
            }, 20000);
        });
    };

    page.onError = function (msg, trace) {


        var msgStack = ['ERROR: ' + msg];

        if (trace && trace.length) {
            msgStack.push('TRACE:');
            trace.forEach(function (t) {
                msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
            });
        }

        console.error(msgStack.join('\n'));

    };

    page.onResourceError = function (resourceError) {
        console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
        console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
    };

    page.onResourceTimeout = function (request) {
        console.log('Response (#' + request.id + '): ' + JSON.stringify(request));
    };

    page.onLoadFinished = function (status) {
        console.log('Status: ' + status);

        if (status !== 'success') {
            cb('error');
            page.close();
            console.log('FAIL to load the address');
        } else {
            console.log('Loading time ' + (Date.now() - time) + ' msec');
        }
    };

    page.open(url);
};

server.listen(port, function (request, response) {

    //console.log(urlPrefix);
    //console.log(request.url);
    //console.log(JSON.stringify(request));


    var urlRequest = request.url.replace('%3A/', '//').substring(1, request.url.length);

    var parser = urlapi.parse(urlRequest);
    parser.href = urlRequest;

    //var url = parser.protocol + '//' + parser.host + parser.pathname;
    //FIXME en phantonjs 1.9 funciona asi
    var url = parser.pathname.replace('http//', 'http://');
    var pathName = parser.pathname;


    var pattern = new RegExp(/\.(js|css|xml|appcache|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|doc|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff)$/mgi);
    if (pattern.test(pathName)) {
        console.info('[Omitido] ' + url);
        response.close();
    } else {
        console.info('[Procesando] ' + url);

        //cache.get(url, function (err, data) {
        //
        //    if(err || !data) {
        //        console.log('NOCACHE');
        //        console.log(err,data);
                renderHtml(url, function (html) {


                    cache.set(url, html, 60, function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                    response.statusCode = 200;
                    response.write(html);
                    response.close();
                });
        //    }else{
        //        console.log('FROM cache');
        //        response.statusCode = 200;
        //        response.write(data);
        //        response.close();
        //    }
        //
        //});


    }
});

console.log('Listening on ' + port + '...');
console.log('Press Ctrl+C to stop.');