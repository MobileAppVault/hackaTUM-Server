var User = require( '../models/user' );
var Product = require( '../models/product' );
var RatingLog = require( '../models/ratingLog' );

// GET: products
exports.getProducts = ( req, res, next ) => {
  
  Product.find( ).exec( ( err, products ) => {
    
      if ( err ) return res.status( 500 ).json( err );

      res.json( products );

  } );

};

// POST: product
exports.postProductDetails = ( req, res, next ) => {

  var productid = ( req.body.productid ? req.body.productid : '' );
  var userid = ( req.body.userid ? req.body.userid : '' );
  var pushid = ( req.body.pushid ? req.body.pushid : '' );

  if ( productid === '' ) res.status( 500 ).json( { status : "ERROR", message : "product id is empts" } );
  
  // if user not exists => create new user
  if ( userid === '' ) {
    
    var user = new User( {
      name: '',
      avatar: '',
      pushid: pushid,
      notificationactive: true,
      bucks: 10
    } );

    user.save( ).then( ( user ) => {
    
      getProduct( productid, user.id, ( err, json ) => {
    
        if ( err ) return res.status( 500 ).json( err );
    
        res.json( json );
    
      });
      
    }, ( err ) => {
    
      return res.status( 400 ).json( err );
    
    } );
    
  }  else {
    
    getProduct( productid, userid, ( err, json ) => {
      
      if ( err ) return res.status( 500 ).json( err );
      
      res.json( json );
    
    });
  }

}

getProduct = ( productid, userid, callback ) => {

  // request product
  Product.findById( productid ).exec( ( err, product ) => {
  
    if ( err ) callback( err );
    
    // check if ratingLog entries exists and count likes/ dislikes
   
    // get likes
    RatingLog.count( { "productid": productid, like: true } , ( err, countLike ) => {
        
      //if ( err ) return res.status( 500 ).json( err );

      RatingLog.count( { "productid": productid, dislike: true } , ( err, countDislike ) => {
          
        //if ( err ) return res.status( 500 ).json( err );
        
        countLike = ( countLike ? countLike : 1 );
        countDislike = ( countDislike ? countDislike : 0 );

        var funfactor = ( countLike / 100 ) * ( countLike + countDislike ) * 100;
        
        if ( funfactor > 100 ) funfactor = 100;

        if (productid === '582861fd8c26fa13f339bb7d') {
          funfactor = 90;
        } else {
          funfactor = 40;
        }

        callback( null, {
          userid: userid,
          product: product,
          rating: { 
            funfactor: funfactor, 
            likes: countLike, 
            dislikes: countDislike
          }
        } );

      } );

    } );

  } );

};
