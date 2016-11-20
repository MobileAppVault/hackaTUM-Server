var mongoose = require( 'mongoose' );

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var questionSchema = new mongoose.Schema( {
  productid: String,
  userid: String,
  finished: Boolean
}, schemaOptions );

module.exports = mongoose.model( 'QuestionLog', questionSchema );

