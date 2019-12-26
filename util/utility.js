

class Utility {
  static sortProducts = (products) => {
    if (products.length == 0) {
        return [];
      }
      var sortedProducts = [];
      while (products.length) {
        sortedProducts.push(products.splice(0, 3));
      }
      return sortedProducts;
  }
}


module.exports = Utility;