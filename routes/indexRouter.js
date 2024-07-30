const { Router } = require("express");

const indexRouter = Router();

indexRouter.get("/", (req, res, next) => {
  res.redirect("/dashboard");
});

module.exports = indexRouter;
