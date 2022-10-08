var CronJob = require("cron").CronJob;
new CronJob(
  "1 */6 * * * *",
  async function () {
    const data = require("./model").data;
    data.planets.forEach(async (planet) => {
      //为了将请求平均分配在10分钟的时间段内增加一些延时
      await new Promise((resolve) => setTimeout(resolve, planet.delaySeed));
      updateIPNS(planet);
    });
  },
  null,
  true,
  "America/Los_Angeles"
);

const log = require("./log")("cron");

async function updateIPNS(p) {
  log.info("update comments content ...");
  const planet = await require("./ipfs").getPlanet(p.key);
  if (!planet.articles || !planet.articles.length) {
    log.error(`ipns ${planet.key} may have bad content, no article!`);
    return;
  }
  const planetRoot = require("path").join(
    require("./model").ROOT,
    "planets",
    p.key
  );
  if (!require("fs").existsSync(planetRoot)) {
    require("fs").mkdirSync(planetRoot, { recursive: true });
  }
  for (let article of planet.articles) {
    if (!article.id) {
      log.error(`ipns ${planet.key} may have bad content, no id!`);
      return;
    }
    const commentsPath = require("path").join(planetRoot, `${article.id}.json`);
    const url = `${p.ce}/${p.key}/${article.id}`;
    log.info(`fetch comments content of article from url ${url} ...`);
    try {
      const comments = await require("axios").get(url);
      require("fs").writeFileSync(commentsPath, JSON.stringify(comments.data));
    } catch (ex) {
      log.error("fetch comments fail", { url, ex });
    }
  }
  const cid = await require("./ipfs").addDirectory(planetRoot);
  log.info("got cid for planets", { key: p.key, cid });
  require("./ipfs").publish(p.key, cid);
}

module.exports = {
  updateIPNS,
};
