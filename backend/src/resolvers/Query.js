const { forwardTo } = require("prisma-binding");

const Query = {
  datapoints: forwardTo("db"),
  /* async datapoints(parent, args, ctx, info) {
        const dps = await ctx.db.query.datapoints();
        return dps;
    } */ // alternative way to write the above query
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },
};

module.exports = Query;
