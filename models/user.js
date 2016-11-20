var mongoose = require( 'mongoose' );

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var userSchema = new mongoose.Schema( {
  name: String,
  avatar: String,
  pushid: String,
  notificationactive: Boolean,
  bucks: Number
}, schemaOptions );

module.exports = mongoose.model( 'User', userSchema );
