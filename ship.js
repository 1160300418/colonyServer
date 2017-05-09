function Ship(data/*, index*/) {
    this.x = data[0];
    this.y = data[1];
    this.from = data[2];
    this.to = data[3];
    this.camp = data[4];
    this.population = data[5];
    this.fromX = data[6];
    this.fromY = data[7];
    //this.index = index;
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
        //delete ships[this.index];
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
module.exports = Ship;
var config;
exports.config = function(conf){
    config=conf;
}