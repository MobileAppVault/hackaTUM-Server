var mongoose = require( 'mongoose' );

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var productSchema = new mongoose.Schema( {
  productid: String,
  title: String,
  content: String,
  features: String,
  link: String,
  image: String,
  price: Number,
}, schemaOptions );

module.exports = mongoose.model( 'Product', productSchema );
