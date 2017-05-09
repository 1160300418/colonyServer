var Ship = require('./ship.js');
var Star = require("./star.js");

var lastTime,
    timer = 0,
    fps = 60;

var config = {
    maxPopulation: 20,
    initPopulation: 10,
    maxCamp: 6,
    globalSpeed: 1,
    growthSpeed: 1,
    shipSpeed: 100,
    starspeed: 0.04,
    combatSpeed: 3.5,
    captureSpeed: 0.2,
    shootSpeed: 1.5,
    shootRange: 100
};
Star.config(config);
Ship.config(config);

function calculateFpsAndTime() {
    var now = Date.now();
    timer += now - lastTime;
    fps = 1000 / (now - lastTime);
    lastTime = now;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function shipOut(from, to, camp, ratio,data) {
    if (from === to) return;
    if (!data.stars[from].population[camp]) return;
    var movePopulation = parseInt((data.stars[from].population[camp] * ratio).toFixed());
    data.stars[from].out(movePopulation, camp);
    var shipArray = [data.stars[from].x, data.stars[from].y, from, to, camp, movePopulation, data.stars[from].x, data.stars[from].y]
    var aship = new Ship(shipArray);
    data.ships.push(aship);
}

function loadMap(data) {
    lastTime = Date.now();
    config.maxCamp = data.maxCamp;
    timer = 0;
    for (var i = 0; i < data.map.length; i++) {
        data.stars.push(new Star(data.map[i], i));
    }
    animation(data);
}

function updateFrame(data) {
    data.stars.forEach(function (star) {
        star.frame();
    });
    data.ships.forEach(function (ship) {
        ship.frame();
    });
    wincheck();
}

function wincheck() {}

function animation(data) {
    updateFrame(data);
    calculateFpsAndTime();
    window.setTimeout(animation(data), 1000 / 60);
}
function converter(data){
    var dataArray={
        stars:[],
        ships:[]
    }
    data.stars.forEach(function(star){
        dataArray.stars[star.index]=star.converter();
    });
    data.ships.forEach(function(ship){
        dataArray.ships.push(ship.converter());
    })
    return dataArray;
}
exports.shipOut = shipOut;
exports.loadMap = loadMap;
exports.converter = converter;