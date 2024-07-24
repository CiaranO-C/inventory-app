const { Router } = require("express");
const categoryController = require("../controllers/categoryController");

const categoriesRouter = Router();

categoriesRouter.get('/', categoryController.categoriesGet)

module.exports = categoriesRouter;
