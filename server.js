var http = require('http');
var url = require('url');
var ws = require('ws');
var fs = require('fs');

var mimetype = {
  'txt': 'text/plain',
  'html': 'text/html',
  'css': 'text/css',
  'xml': 'application/xml',
  'json': 'application/json',
  'js': 'application/javascript',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'png': 'image/png',
  'svg': 'image/svg+xml'
}

var wsport = 8888,
    httpport = 8000;


var server = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log(pathname);
    if(pathname=='/')pathname="/index.html";
    var realPath = __dirname + '/www' + pathname;
    fs.exists(realPath, function (exists) {
        if (!exists) {
            res.writeHead(404, {
                'Content-Type': 'text/html'
            });
            res.write('<!doctype html>\n');
            res.write('<title>404 Not Found</title>\n');
            res.write('<h1>Not Found</h1>');
            res.write('<p>The requested URL ' + pathname + ' was not found on this server.</p>');
            res.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    res.end(err);
                } else {
                    var contentType = mimetype[realPath.split('.').pop()] || "text/plain";
                    res.writeHead(200, {
                        'Content-Type': contentType
                    });
                    res.write(file, "binary");
                    res.end();
                }
            });
        }
    })
});
server.listen(httpport);
console.log("Server is running at "+ httpport);

var wss = new ws.Server({
    port: wsport
});

wss.on('connection', function (ws) {
    console.log('connected');
    ws.on('message', function (message) {
        console.log(message);
    })
})