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
        if (this.atWar || this.capturing || camp === 0 || this.type !== 1 && this.type !== 3) return;
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
module.exports = Star;
var config;
exports.config = function(conf){
    config=conf;
}