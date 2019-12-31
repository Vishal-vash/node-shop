const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is-auth');
const shopCtrl = require('../controllers/shop')


router.get('/', shopCtrl.getIndex);

router.get('/products', shopCtrl.getProducts);

router.get('/products/:productId', shopCtrl.getProduct);

router.get('/cart', isAuth, shopCtrl.getCart);

router.post('/cart', isAuth, shopCtrl.postCart);

router.post('/cart-delete-product', isAuth, shopCtrl.postCartDeleteProduct);

router.post('/post-order', isAuth, shopCtrl.postOrder);

router.get('/orders', isAuth, shopCtrl.getOrders);

// router.get('/checkout', shopCtrl.getCheckout);

module.exports = router;