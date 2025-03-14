const { Router } = require("express");
const categoriesRouter = require("./categoriesRouter");
const itemsRouter = require("./itemsRouter");
const dashController = require("../controllers/dashController");

const dashboardRouter = Router();

dashboardRouter.use('/categories', categoriesRouter);
dashboardRouter.use('/items', itemsRouter);

//render main dashboard
dashboardRouter.get('/', dashController.dashboardGet)

module.exports = dashboardRouter;
