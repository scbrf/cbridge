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

async function updateIPNS(p) {
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
    const comments = await require("axios").get(
      `${p.ce}/${p.key}/${article.id}`
    );
    require("fs").writeFileSync(commentsPath, JSON.stringify(comments.data));
  }
  const cid = await require("./ipfs").addDirectory(planetRoot);
  require("./ipfs").publish(p.key, cid);
}

module.exports = {
  updateIPNS,
};
