var ws; //websocket实例
var reconnectCount = 0; //避免重复连接
var pingTime;
var ping;
var connected = false;
var isadmin = false;
var wsUrl = 'ws://localhost:8888';
var id;
var uuid;

document.getElementById("ip").value = "ws://" + window.location.hostname + ":8888";
//thanks http://www.cnblogs.com/1wen/p/5808276.html
function createWebSocket(url) {
    try {
        ws = new WebSocket(url);
        initEventHandle();
    } catch (e) {
        reconnect(url);
    }
}

function initEventHandle() {
    ws.onclose = function () {
        console.log("connection close");
        reconnect(wsUrl);
    };
    ws.onerror = function () {
        console.log("connection error");
        reconnect(wsUrl);
    };
    ws.onopen = function () {
        //心跳检测重置
        console.log("connected");
        reconnectCount = 0;
        connected = true;
        login();
        if (!isadmin) {
            main(4);
        }
        heartCheck.reset();
    };
    ws.onmessage = function (e) {
        //如果获取到消息，心跳检测重置
        //拿到任何消息都说明当前连接是正常的
        openMsg(e.data);
        heartCheck.reset();
    };
}

function reconnect(url) {
    if (reconnectCount > 5) {
        if (id) {
            console.log("connection loss");
        }else{
            console.log(ip+" is not a WebSocket server")
        }
        connected = false;
        $("#connect").show();
        $("#ip").show();
        $("#id").show();
        init();
        return;
    }
    reconnectCount++;
    setTimeout(function () {
        createWebSocket(url);
    }, 2000);
}

//心跳检测
var heartCheck = {
    timeout: 20000, //20秒
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function () {
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        this.start();
    },
    start: function () {
        reconnectCount = 0;
        var self = this;
        this.timeoutObj = setTimeout(function () {
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            ws.send("ping");
            pingTime = Date.now();
            self.serverTimeoutObj = setTimeout(function () { //如果超过一定时间还没重置，说明后端主动断开了
                ws.close(); //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout);
        }, this.timeout);
    }
};

function creatuuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function sendMsg(msg) {
    if (ws.readyState == ws.OPEN) {
        ws.send(msg);
        console.log("send one message successfully:\n" + msg);
    } else {
        console.log("fail to send message:\n" + msg);
    }
}

function openMsg(message) {
    if (message == "pong") {
        ping = Date.now() - pingTime;
        document.getElementById("input_ping").value = 'ping: ' + ping.toFixed() + "ms";
        return;
    }
    console.log("received a message:\n" + message);
    try {
        msg = JSON.parse(message);
        switch (msg.type) {
            case "camp":
                camp = msg.camp;
                break;
            case "mapload":
                if (!data.maps) data.maps = [];
                data.maps.push(msg.map);
                mapSelect = data.maps.length;
                break;
            case "start":
                window.removeEventListener("resize", title);
                loadMap();
                break;
            case "exit":
                reconnectCount = 6;
                reconnect(wsUrl);
                break;
            case "ship":
                shipOut(msg.ship[0], msg.ship[1], msg.ship[2], msg.ship[3], true);
                break;
        }
    } catch (e) {
        console.log(e);
        console.log(message);
    }
    console.log(msg);
}

function login() {
    if (id == "admin") {
        isadmin = true;
    }
    uuid = uuid || creatuuid();
    sendMsg(JSON.stringify({
        type: "login",
        id: id,
        uuid: uuid
    }));
}