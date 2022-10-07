var CronJob = require("cron").CronJob;
new CronJob(
  "1 */10 * * * *",
  async function () {
    const data = require("./model").data;
    data.planets.forEach(async (planet) => {
      updateIPNS(planet);
    });
  },
  null,
  true,
  "America/Los_Angeles"
);

const COMMENT_BASE = "https://comments.scbrf.workers.dev";

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
      `${COMMENT_BASE}/${p.key}/${article.id}`
    );
    require("fs").writeFileSync(commentsPath, JSON.stringify(comments));
  }
  const cid = await require("./ipfs").addDirectory(planetRoot);
  require("./ipfs").publish(p.key, cid);
}

updateIPNS(require("./model").data.planets[0]);
