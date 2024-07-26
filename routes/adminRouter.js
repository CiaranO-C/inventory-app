const { Router } = require('express');
const adminController = require('../controllers/adminController');

const adminRouter = Router();

adminRouter.get('/:id', adminController.adminFormGet)
adminRouter.post('/:id', adminController.adminFormPost)

module.exports = adminRouter
