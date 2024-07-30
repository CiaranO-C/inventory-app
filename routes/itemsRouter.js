const { Router } = require("express");
const itemController = require("../controllers/itemController");

const itemsRouter = Router();

//itemsRouter.get("/", itemController.allItemsGet);
itemsRouter.get("/in-stock", itemController.inStockGet);
itemsRouter.post("/in-stock", itemController.handleSort, itemController.inStockGet);

itemsRouter.get("/low-stock", itemController.lowStockGet);
itemsRouter.post("/low-stock", itemController.handleSort, itemController.lowStockGet);

itemsRouter.get("/out-of-stock", itemController.outOfStockGet);
itemsRouter.post("/out-of-stock", itemController.handleSort, itemController.outOfStockGet);

itemsRouter.get("/create", itemController.createItemGet);
itemsRouter.post("/create", itemController.createItemPost);

itemsRouter.get("/sort", itemController.handleSort);

itemsRouter.get("/:id", itemController.singleItemGet);
itemsRouter.post("/:id", itemController.updateItemForm);

itemsRouter.post("/:id/update", itemController.updateItemPost);
itemsRouter.post("/:id/delete", itemController.deleteOnePost);

module.exports = itemsRouter;
