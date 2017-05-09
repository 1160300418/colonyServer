var http = require('http');
var url = require('url');
var Wss = require('ws').Server;
var fs = require('fs');
var colony = require('./colony.js');

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
};

var wsport = 8888,
    httpport = 8000;


var server = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log(pathname);
    if (pathname == '/') pathname = "/index.html";
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
    });
});
server.listen(httpport);
console.log("Server is running at " + httpport);

var clients = [];
var data = {
    map:undefined,
    stars: [],
    ships: [],
    maxCamp: 6
};
var admin;
var running = false;

var wss = new Wss({
    port: wsport
});

wss.broadcast = function broadcast(msg) {
    console.log("broadcast one message\n" + msg);
    wss.clients.forEach(function each(client) {
        if (client.readyState === client.OPEN && typeof client.id != "undefined") {
            console.log(client.id);
            client.send(msg);
        }
    });
};

wss.on('connection', function (ws) {
    console.log('connected ,' + (clients.length + 1) + " clients now");
    ws.on('message', function (message) {
        if (message == "ping") {
            ws.send("pong");
            return;
        }
        console.log("received a message:\n" + message);
        try {
            msg = JSON.parse(message);
            switch (msg.type) {
                case "login":
                    login(ws, msg);
                    break;
                case "mapUpload":
                    data.map = msg.map.map;
                    data.maxCamp = msg.map.maxCamp;
                    data.equality = msg.map.equality
                    wss.broadcast(JSON.stringify({
                        type: "mapload",
                        map: {
                            "map": data.map,
                            "equality": data.equality,
                            "maxCamp": data.maxCamp
                        }
                    }));
                    setTimeout(function(){
                        wss.broadcast(JSON.stringify({
                            type:"start"
                        }))
                        colony.loadMap(data);
                        running = true;
                    },1000);
                    break;
                case "ship":
                    colony.shipOut(msg.ship[0], msg.ship[1], msg.ship[2], msg.ship[3],data);
                    wss.broadcast(message);
                    break;
            }
        } catch (e) {
            console.log(e);
            console.log(message);
        }
    });
    setInterval(function(){
        if(running){
            wss.broadcast(JSON.stringify({
                type:"sync",
                data:colony.converter(data)
            }));
        }
    },3000);
});

function login(ws, msg) {
    ws.id = msg.id;
    ws.uuid = msg.uuid;
    if (ws.id == "admin") {
        if (admin) {
            ws.send(JSON.stringify({
                type: "exit",
                reason: "administrator is existent"
            }));
        } else {
            admin = ws;
            ws.isadmin = true;
            ws.send(JSON.stringify({
                type: "camp",
                camp: 0
            }));
            return;
        }
    }
    var repeatId = false;
    for (var i = 0; !repeatId && i < clients.length; i++) {
        if (clients[i] && clients[i].id == ws.id) {
            repeatId = true;
            if (ws.uuid == clients[i].uuid) {
                clients[i] = ws;
            } else {
                ws.send(JSON.stringify({
                    type: "exit",
                    reason: "You have the same id with another user"
                }));
            }
        }
    }
    if (!repeatId) {
        if (clients.length >= data.maxCamp) {
            ws.send(JSON.stringify({
                type: "exit",
                reason: "The players reach the upper limit of server"
            }));
            return;
        }
        ws.camp = clients.length + 1;
        ws.send(JSON.stringify({
            type: "camp",
            camp: ws.camp
        }));
        if (data.map) {
            ws.send(JSON.stringify({
                type: "mapload",
                map: {
                    "map": data.map,
                    "equality": data.equality,
                    "maxCamp": data.maxCamp
                }
            }));
        }
        clients.push(ws);
    }
}