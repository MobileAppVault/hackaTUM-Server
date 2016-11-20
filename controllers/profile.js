var mongoose = require('mongoose');
var User = require( '../models/user' );

// GET: profile/:id
exports.getProfile = ( req, res, next ) => {
  
  User.findById( req.params.id ).exec( ( err, user ) => {
  
    if ( err ) return res.status( 500 ).json( err );
  
    res.json( user );
  
  } );

}

// POST: profile
exports.postProfile = ( req, res, next ) => {
  
  var name = ( req.body.name ? req.body.name : '' );
  var avatar = ( req.body.avatar ? req.body.avatar : '' );
  var pushid = ( req.body.pushid ? req.body.pushid : '' );
  var notificationactive = ( req.body.notificationactive ? req.body.notificationactive : true );
  var bucks = 0;

  var user = new User( {
    name: name,
    avatar: avatar,
    pushid: pushid,
    notificationactive: notificationactive,
    bucks: bucks
  } );

  user.save( ).then( ( user ) => {
    res.json( user );
  }, ( err ) => {
    return res.status( 400 ).json( err );
  } );

};

// PUT: profile/:id
exports.putProfile = ( req, res, next ) => {
  
  var name = ( req.body.name ? req.body.name : '' );
  var avatar = ( req.body.avatar ? req.body.avatar : '' );
  var pushid = ( req.body.pushid ? req.body.pushid : '' );
  var notificationactive = ( req.body.notificationactive ? req.body.notificationactive : true );

  User.findById( req.params.id ).exec( ( err, user ) => {

    if ( !user ) return res.status( 400 ).json( {message: "cannot find user with id " + req.body.id} );
    
    user.name = name;
    user.avatar = avatar;
    user.pushid = pushid;
    user.notificationactive = notificationactive;

    user.save( ).then( ( user ) => {
      res.json( user );
    }, ( err ) => {
      return res.status( 400 ).json( err );
    } );
      
  } );
  
};

// GET: profiles
exports.getProfiles = ( req, res, next ) => {
  
  User.find( ).exec( ( err, users ) => {
    
      if ( err ) return res.status( 500 ).json( err );

      res.json(users);

  } );

};