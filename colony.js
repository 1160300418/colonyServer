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

function Star(data, index) {
    this.x = data[0];
    this.y = data[1];
    this.size = data[2];
    this.camp = data[3];
    this.type = data[4];
    this.ox = data[5];
    this.oy = data[6];
    this.a = data[7];
    this.b = data[8];
    this.t = data[9];
    this.index = index;
    this.totalPopulation = 0;
    this.totalCamp = 1;
    this.atWar = false;
    this.capturing = false;
    this.captureCent = 0;
    this.captureCamp = undefined;
    this.population = []; //index is its camp
    if (this.camp !== 0 && (this.type == 1 || this.type == 3)) {
        this.population[this.camp] = this.size * config.initPopulation;
    }
}
Star.prototype = {
    move: function (time) {
        if (time) {
            if (!this.a || !this.b) {
                return {
                    x: this.x,
                    y: this.y
                };
            } else {
                return {
                    x: this.a * Math.cos(this.t * 2 * Math.PI+ time) + this.ox,
                    y: this.b * Math.sin(this.t * 2 * Math.PI+ time) + this.oy
                };
            }
        } else {
            if (!this.a || !this.b) return;
            this.t += config.starspeed * config.globalSpeed / fps;
            this.x = this.a * Math.cos(this.t * 2 * Math.PI) + this.ox;
            this.y = this.b * Math.sin(this.t * 2 * Math.PI) + this.oy;
        }
    },
    shoot: function () {
        if (this.type !== 2 && this.type !== 3) return;
        for (var i = 0, len = ships.length; i < len; i++) {
            if (!ships[i]) continue;
            var dis = distance(this.x, this.y, ships[i].x, ships[i].y);
            if (dis <= config.shootRange * this.size) {
                ships[i].shot();
                ctx.strokeStyle = color[this.camp];
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(ships[i].x, ships[i].y);
                ctx.stroke();
            }
        }
    },
    count: function () {
        this.totalCamp = 0;
        this.totalPopulation = 0;
        this.captureCamp = undefined;
        for (var i = 0; i < config.maxCamp; i++) {
            if (!this.population[i]) continue;
            this.totalPopulation += this.population[i];
            this.totalCamp++;
            this.captureCamp = i;
        }
    },
    combat: function () {
        if (this.totalCamp < 2) {
            this.atWar = false;
            return;
        }
        this.atWar = true;
        for (var i = 0; i < config.maxCamp; i++) {
            if (!this.population[i]) continue;
            if (this.population[i] < 0) this.population[i] = undefined;
            this.population[i] -= config.combatSpeed * config.globalSpeed / fps;
        }
    },
    capture: function () {
        if (!this.atwar && (this.captureCent || this.totalCamp === 1 && !this.population[this.camp])) {
            this.capturing = true;
        } else {
            this.capturing = false;
            return;
        }
        if (this.captureCent && this.totalCamp === 0) {
            this.captureCent -= config.captureSpeed * config.globalSpeed / fps / 2;
        }
        if (this.captureCent < 0 && this.camp !== this.captureCamp || this.camp === 0 && !this.captureCent) {
            this.camp = this.captureCamp;
            this.captureCent = 0.001;
        }
        if (!this.captureCent && this.camp !== 0 && this.camp !== this.captureCamp) this.captureCent = 1;
        if (this.camp !== this.captureCamp) {
            this.captureCent -= config.captureSpeed * config.globalSpeed / fps * 2;
        }
        if (this.camp === this.captureCamp) {
            this.captureCent += config.captureSpeed * config.globalSpeed / fps;
        }
        if (this.captureCent > 1 && this.camp === this.captureCamp) {
            this.captureCent = undefined;
        }
    },
    grow: function () {
        if (this.atWar || this.capturing || this.camp === 0 || this.type !== 1 && this.type !== 3) return;
        if (this.population[this.camp] < this.size * config.maxPopulation) {
            this.population[this.camp] += config.growthSpeed * config.globalSpeed / fps;
        }
        if (this.population[this.camp] > this.size * (config.maxPopulation + config.initPopulation)) {
            this.population[this.camp] -= config.growthSpeed * config.globalSpeed / fps / 2;
        }
    },
    out: function (n, camp) {
        if (!this.population[camp]) return;
        this.population[camp] -= n;
        if (this.population[camp] < 0) this.population[camp] = 0;
    },
    in: function (n, camp) {
        if (!this.population[camp]) this.population[camp] = 0;
        this.population[camp] += n;
    },
    array: function () {
        return [this.x,
            this.y,
            this.size,
            this.camp,
            this.type,
            this.ox,
            this.oy,
            this.a,
            this.b,
            this.t
        ];
    },
    frame: function () {
        this.count();
        this.move();
        this.shoot();
        this.combat();
        this.capture();
        this.grow();
    }
};

function Ship(data) {
    this.x = data[0];
    this.y = data[1];
    this.from = data[2];
    this.to = data[3];
    this.camp = data[4];
    this.population = data[5];
    this.fromX = data[6];
    this.fromY = data[7];
}
Ship.prototype = {
    move: function () {
        try{
        if (stars[this.to].a) {
            this.disX = stars[this.to].x - this.fromX;
            this.disY = stars[this.to].y - this.fromY;
            var dis0 = Math.sqrt(this.disX * this.disX + this.disY * this.disY);
            var t = dis0 / config.shipSpeed * config.starspeed;
            var loc = stars[this.to].move(t);
            this.disX = loc.x - this.fromX;
            this.disY = loc.y - this.fromY;
            this.dis = Math.sqrt(this.disX * this.disX + this.disY * this.disY);
            this.x += this.disX / this.dis * config.shipSpeed * config.globalSpeed / fps;
            this.y += this.disY / this.dis * config.shipSpeed * config.globalSpeed / fps;
            if (distance(this.x, this.y, stars[this.to].x, stars[this.to].y) < 90) {
                this.arrive();
            }
        } else {
            this.disX = stars[this.to].x - this.fromX;
            this.disY = stars[this.to].y - this.fromY;
            this.dis = Math.sqrt(this.disX * this.disX + this.disY * this.disY);
            this.x += this.disX / this.dis * config.shipSpeed * config.globalSpeed / fps;
            this.y += this.disY / this.dis * config.shipSpeed * config.globalSpeed / fps;
            if ((this.x - stars[this.to].x) * this.disX > 0 || (this.y - stars[this.to].y) * this.disY > 0) {
                this.arrive();
            }
        }}catch(e){
            console.log(e);
            console.log(stars);
        }
    },
    shot: function () {
        this.population -= config.shootSpeed * stars[this.to].size * config.globalSpeed / fps;
    },
    arrive: function () {
        stars[this.to].in(this.population, this.camp);
        ships.splice(ships.indexOf(this),1);
    },
    array: function () {
        return [this.x,
            this.y,
            this.from,
            this.to,
            this.camp,
            this.population,
            this.fromX,
            this.fromY
        ];
    },
    frame: function () {
        this.move();
    }
};


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
    setTimeout(animation(data), 1000 / 60);
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