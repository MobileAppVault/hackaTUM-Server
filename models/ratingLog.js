var mongoose = require( 'mongoose' );

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var ratingSchema = new mongoose.Schema( {
  productid: String,
  userid: String,
  like: Boolean,
  dislike: Boolean
}, schemaOptions );

module.exports = mongoose.model( 'RatingLog', ratingSchema );

