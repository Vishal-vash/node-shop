const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  productName: {
    type: String,
    required: true
  },
  productImgUrl: {
    type: String,
    required: true
  },
  productPrice: {
    type: String,
    required: true
  },
  productDesc: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Product', ProductSchema);
