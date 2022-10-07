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
    } else {
      this.data = {
        planets: [],
      };
    }
  }
  add(planet) {
    this.data.planets.push(planet);
    require("fs").writeFileSync(this.jsonPath, JSON.stringify(this.data));
  }
}

module.exports = new Storage();
