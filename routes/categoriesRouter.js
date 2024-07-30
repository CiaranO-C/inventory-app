const { Router } = require("express");
const categoryController = require("../controllers/categoryController");

const categoriesRouter = Router();

categoriesRouter.get("/", categoryController.allCategoriesGet);

categoriesRouter.get("/create", (req, res, next) => {
  res.redirect("/dashboard");
});

categoriesRouter.post("/confirm-create", categoryController.confirmCreatePost);
categoriesRouter.post("/create", categoryController.createCategoryPost);

categoriesRouter.get("/:id", categoryController.singleCategoryGet);
categoriesRouter.post("/:id", categoryController.categoryUpdateForm);

categoriesRouter.post("/:id/delete", categoryController.deleteCategoryConfirm);

categoriesRouter.get("/:id/update", categoryController.updateCategoryGet);
categoriesRouter.post("/:id/update", categoryController.updateCategoryPost);

module.exports = categoriesRouter;
