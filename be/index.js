require("./cron");
const Koa = require("koa");
const log = require("./log")("main");

async function logger(ctx, next) {
  const start = new Date().getTime();
  try {
    await next();
    log.debug(
      `${((new Date().getTime() - start) / 1000).toFixed(3)} ${
        ctx.request.url
      }, ${JSON.stringify(ctx.request.body)},${ctx.status}, ${JSON.stringify(
        ctx.body
      )}`
    );
  } catch (ex) {
    log.debug(
      `${((new Date().getTime() - start) / 1000).toFixed(3)} ${
        ctx.request.url
      }, ${JSON.stringify(ctx.request.body)}, ${ex}`
    );
    throw ex;
  }
}

async function main() {
  const app = new Koa();
  const bodyParser = require("koa-bodyparser");
  const Router = require("koa-router");
  const router = new Router();
  app.use(bodyParser());
  app.use(logger);
  router.get("/register", async (ctx) => {
    const { ipns, ce } = ctx.request.query;
    if (!ipns || !ce) return ctx.status(404);
    const rec = require("./model").exists(ipns);
    if (rec) {
      ctx.body = { ipns: rec.ipns };
      return;
    }
    const planet = await require("./ipfs").getPlanet(ipns);
    if (!planet || !planet.articles) {
      log.error("fail to fetch planet.json");
      return ctx.status(403);
    }
    const result = await require("./ipfs").generateKey(ipns);
    require("./model").add({ key: ipns, entry: ce, ipns: result });
    ctx.body = { ipns: result };
  });
  app.use(router.routes()).use(router.allowedMethods());
  const port = 3000;
  log.debug("api server started at port:", port);
  app.listen(port);
}

main();
