const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  }
});

UserSchema.methods.addToCart = function(product) {
  var cartItems = this.cart.items;
  var updatedCartItems = [...cartItems];

  const cartItemIndex = cartItems.findIndex(cp => {
    return cp.productId.toString() == product._id.toString();
  });

  if (cartItemIndex != -1) {
    updatedCartItems[cartItemIndex].quantity += 1;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1
    });
  }

  const updatedCart = {
    items: updatedCartItems
  };
  
  this.cart = updatedCart;

  return this.save()
};

UserSchema.methods.deleteItemFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(val => {
    return val.productId.toString() != productId.toString()
  });
  this.cart.items = updatedCartItems;
  return this.save();
}

UserSchema.methods.clearCart = function() {
  this.cart.items = [];
  return this.save();
}

module.exports = mongoose.model("User", UserSchema);
