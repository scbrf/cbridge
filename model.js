class Storage {
  constructor() {
    this.ROOT = require("path").join(__dirname, "..", "DATA");
    if (!require("fs").existsSync(this.ROOT)) {
      require("fs").mkdirSync(this.ROOT, { recursive: true });
    }
    this.jsonPath = require("path").join(this.ROOT, "all.json");
    if (require("fs").existsSync(this.jsonPath)) {
      this.data = JSON.parse(
        require("fs").readFileSync(this.jsonPath).toString()
      );
      this.assignDelay();
    } else {
      this.data = {
        planets: [],
      };
    }
  }

  //尽可能将请求平均分配以分散服务器压力
  assignDelay() {
    this.data.planets.forEach((p, i) => {
      p.delaySeed = (9999 * i) / this.data.planets.length;
    });
  }

  add(planet) {
    this.data.planets.push(planet);
    this.assignDelay();
    require("fs").writeFileSync(this.jsonPath, JSON.stringify(this.data));
  }
}

module.exports = new Storage();
