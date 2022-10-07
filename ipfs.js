const { execFile } = require("node:child_process");
const log = require("./log")("ipfs");
class IPFS {
  constructor() {
    this.EXE_PATH = require("path").join(__dirname, "..", "bin", "ipfs");
    this.Gateway = "http://127.0.0.1:8080";
  }
  async generateKey(id) {
    log.info(`Generating IPFS keypair for ${id}`);
    const rsp = await this.runIPFSCmd("key", "gen", id);
    return rsp.trim();
  }

  async getPlanet(ipns) {
    const rsp = await require("axios").get(
      `${this.Gateway}/ipns/${ipns}/planet.json`
    );
    return rsp.data;
  }

  async addDirectory(dir) {
    return this.runIPFSCmd("add", "-r", dir, "--cid-version=1", "--quieter");
  }

  async publish(key, cid) {
    return this.runIPFSCmd("name", "publish", `--key=${key}`, `/ipfs/${cid}`);
  }

  async runIPFSCmd(...args) {
    log.debug("running ipfs cmd", args);
    return new Promise((resolve, reject) => {
      execFile(this.EXE_PATH, args, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout.trim());
      });
    });
  }
}

module.exports = new IPFS();
