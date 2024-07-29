const { Router } = require('express');
const adminController = require('../controllers/adminController');

const adminRouter = Router();

adminRouter.get('/:type/:id', adminController.adminFormGet)
adminRouter.post('/delete', adminController.confirmDelete)
adminRouter.post('/:id', adminController.adminFormPost)


module.exports = adminRouter
