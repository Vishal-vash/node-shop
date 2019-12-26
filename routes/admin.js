const express = require('express');

const router = express.Router();

const adminCtrl = require('../controllers/admin');

router.get('/admin/add-product', adminCtrl.getAddProduct);

router.post('/admin/add-product', adminCtrl.postAddProduct);

router.get('/admin/edit-product/:productId', adminCtrl.getEditProduct);

router.post('/admin/edit-product', adminCtrl.postEditProduct);

router.post('/admin/delete-product', adminCtrl.postDeleteProduct);

router.get('/admin/products', adminCtrl.getAdminProducts);


module.exports = router;
