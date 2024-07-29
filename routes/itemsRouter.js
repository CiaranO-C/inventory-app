const { Router } = require("express");
const itemController = require("../controllers/itemController");

const itemsRouter = Router();

itemsRouter.get("/", itemController.allItemsGet);

itemsRouter.get("/create", itemController.createItemGet);
itemsRouter.post("/create", itemController.createItemPost);

itemsRouter.get("/:id", itemController.singleItemGet);
itemsRouter.post("/:id", itemController.updateItemForm);

itemsRouter.post('/:id/update', itemController.updateItemPost); 
itemsRouter.post('/:id/delete', itemController.deleteOnePost);

module.exports = itemsRouter;
