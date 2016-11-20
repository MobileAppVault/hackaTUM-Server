var mongoose = require( 'mongoose' );
var async = require( 'async' );
var uuid = require( 'uuid' );
var faker = require( 'faker' ); // library to create fake data

// Models
var User = require( '../models/user' );
var Product = require( '../models/product' );
var PurchaseLog = require( '../models/purchaseLog' );
var RatingLog = require( '../models/ratingLog' );
var QuestionLog = require( '../models/questionLog' );

// GET dropall
exports.getDropAll = ( req, res, next ) => {
  dropCollections();
  res.send( '<div style="color:#8CD790;text-align:center"><h1>DROP ALL DATA COMPLETED</h1></div>' );
};

// GET fakedata/?drop=true/false
exports.getFakeData = ( req, res, next ) => {

  // should drop database flag ( ?drop=true/false ) 
  var shouldDrop = ( req.query.drop ? req.query.drop : false );

  // setup count parameter -> how many data do you want to fake
  var userCount = 100;
  var productCount = 100;

  // execute setup process step by step
  async.waterfall( [

      // drop collections
      (  ) =>{ if ( shouldDrop ) dropCollections( ); },

      // setup products
      setupProducts( productCount ),
      
      // setup user accounts ( incl. ratingLog, purchaseLog, requestLog)
      setupUsers( userCount ),

      
  ], ( err ) => {
    console.log( '*** error async.waterfall() ***' );
    console.log( err );
  } );

  res.send( '<div style="color:#8CD790;text-align:center"><h1>SETUP COMPLETED</h1></div>' );
      
};

dropCollections = ( ) => {
  console.log( '** dropCollections **' );
  User.remove( {}, ( err ) => { return true ; }  );
  Product.remove( {}, ( err ) => { return true ; } );
  PurchaseLog.remove( {}, ( err ) => { return true ; } );
  RatingLog.remove( {}, ( err ) => { return true ; } );
  QuestionLog.remove( {}, ( err ) => { return true ; } );
}

setupUsers = ( count ) => {

  for ( var i = 0; i < count; i++ ) {
     
    var user = new User( {
      name: faker.name.findName( ),
      avatar: '',
      pushid: '',
      notificationactive: faker.random.boolean( ),
      bucks: faker.random.number( 100 )
    } );

    user.save( ).then( ( res ) => {   
      console.log( '** fake user ' + i + ' **' );
      setupRating( res.id ); // -> setupPurchaser
    } );

  }

};

setupProducts = ( count ) => {

  for ( var i = 0; i < count; i++ ) {
     
    var product = new Product( {
      productid: faker.random.number(  ),
      title: faker.commerce.productName(  ),
      content: faker.lorem.sentence(  ),
      features: '',
      link: faker.internet.url(  ),
      image: faker.image.technics(  ),
      price: faker.commerce.price(  )
    } );

    product.save(  ).then(  ( res ) => {
    
      console.log( '** fake product ' + i + ' **' );
    
    } );

  }

};

setupRating = ( userid ) => {
      
    Product.find( ).exec( ( err, products ) => {

      var countStart = faker.random.number( 70 );
      var countEnd = countStart + faker.random.number( 10 );
      var productCount = 0;

      products.forEach( function( product ) {

        if ( countStart >= productCount ) {
        
          var like = faker.random.boolean( );
          var dislike = like === true ? false : true;

          var rating = new RatingLog( {
              productid: product.id,
              userid: userid,
              like: like,
              dislike: dislike,
          } );

          rating.save( ).then(  ( res ) => {
            console.log( '** fake ratingLog ' + product.id + ' - ' + productCount + ' **' );
            setupPurchaser ( userid, product.id )
          } );

        }
        
        if ( productCount >= countEnd ) return true; 
        productCount++;

      } );

    } );

};

setupPurchaser = ( userid, productid ) => {
      
  var purchase = new PurchaseLog( {
    productid: productid,
    userid: userid,
    purchasedAt: new Date()
  } );

  purchase.save( ).then(  ( res ) => {

    console.log( '** fake purchase ' + productid + ' - ' + userid + ' **' );

  } );

};

  
  