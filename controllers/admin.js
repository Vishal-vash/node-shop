const Product = require("../models/product");
const Utility = require("../util/utility");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Admin Add Product",
    path: "admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const pName = req.body.productName;
  const pImgUrl = req.body.productImgUrl;
  const pPrice = req.body.productPrice;
  const pDesc = req.body.productDesc;
  const product = new Product({
    productName: pName,
    productImgUrl: pImgUrl,
    productPrice: pPrice,
    productDesc: pDesc,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;
  Product.findById(prodId).then(product => {
    res.render("admin/edit-product", {
      product: product,
      docTitle: "Admin Edit Product",
      path: "admin/edit-product",
      editing: editMode == "true" ? true : false,
      isAuthenticated: req.session.isLoggedIn
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const prodName = req.body.productName;
  const prodImgUrl = req.body.productImgUrl;
  const prodPrice = req.body.productPrice;
  const prodDesc = req.body.productDesc;

  Product.findById(prodId)
    .then(productEdited => {
      productEdited.productName = prodName;
      productEdited.productImgUrl = prodImgUrl;
      productEdited.productPrice = prodPrice;
      productEdited.productDesc = prodDesc;
      productEdited.save();
    })
    .then(result => {
      console.log("Product UPdated !!");
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.delProdId;
  Product.findByIdAndRemove(prodId)
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getAdminProducts = (req, res, next) => {
  Product.find().then(products => {
    res.render("admin/products", {
      products: Utility.sortProducts(products),
      docTitle: "Admin Products",
      path: "admin/products",
      isAuthenticated: req.session.isLoggedIn
    });
  });
};
