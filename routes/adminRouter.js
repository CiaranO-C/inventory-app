const { Router } = require('express');
const adminController = require('../controllers/adminController');

const adminRouter = Router();

adminRouter.post('/category/delete', adminController.confirmCategoryDelete)
adminRouter.post('/item/delete', adminController.confirmItemDelete)
adminRouter.get('/:type/:id', adminController.adminFormGet)
adminRouter.post('/:id', adminController.adminFormPost)


module.exports = adminRouter
