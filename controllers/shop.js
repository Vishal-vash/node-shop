const Product = require("../models/product");
const Order = require("../models/order");
const Utility = require("../util/utility");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/index", {
        products: Utility.sortProducts(products),
        docTitle: "Shop Products",
        path: "shop",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find().then(products => {
    res.render("shop/product-list", {
      products: Utility.sortProducts(products),
      docTitle: "Products",
      path: "products",
      isAuthenticated: req.session.isLoggedIn
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render("shop/product-details", {
        product: product,
        docTitle: "Product Details",
        path: "products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      res.render("shop/cart", {
        docTitle: "Cart",
        path: "cart",
        cartProducts: user.cart.items,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => res.redirect("/cart"));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.cartDeleteProdId;
  req.user
    .deleteItemFromCart(prodId)
    .then(() => res.redirect("/cart"))
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "checkout",
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      res.render("shop/orders", {
        docTitle: "Orders",
        path: "orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(val => {
        return {
          quantity: val.quantity,
          product: { ...val.productId._doc }
        };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(() => {
      req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
};
