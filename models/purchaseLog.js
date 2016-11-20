var mongoose = require( 'mongoose' );

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var purchaseSchema = new mongoose.Schema( {
  productid: String,
  userid: String,
  purchasedAt: Date
}, schemaOptions );

module.exports = mongoose.model( 'PurchaseLog', purchaseSchema );
