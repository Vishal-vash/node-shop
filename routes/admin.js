const express = require('express');
const router = express.Router();

const adminCtrl = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

router.get('/admin/add-product', isAuth, adminCtrl.getAddProduct);

router.post('/admin/add-product', isAuth, adminCtrl.postAddProduct);

router.get('/admin/edit-product/:productId', isAuth, adminCtrl.getEditProduct);

router.post('/admin/edit-product', isAuth, adminCtrl.postEditProduct);

router.post('/admin/delete-product', isAuth, adminCtrl.postDeleteProduct);

router.get('/admin/products', isAuth, adminCtrl.getAdminProducts);


module.exports = router;
