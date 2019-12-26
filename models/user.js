const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
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



// class User {
//   constructor(username, email, userId, cart) {
//     this.username = username;
//     this.email = email;
//     this._id = userId ? new ObjectId(userId) : null;
//     this.cart = cart;
//   }


//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         products.map(val => delete val["userId"]);
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             username: this.username,
//             email: this.email
//           }
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(order => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch(err => console.log(err));
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray();
//   }
// }

// module.exports = User;
