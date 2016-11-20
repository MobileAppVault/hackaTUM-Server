
var User = require( '../models/user' );
var RatingLog = require( '../models/ratingLog' );

// POST: answer
exports.postAnwser = ( req, res, next ) => {

    // TODO: validation is missing.
    var userid = req.body.userid; 
    var productid = req.body.productid;
  
    var like = req.body.like;
    var dislike = req.body.dislike;
    
    // get user data ( purchaser )
    User.findById( userid ).exec(( err, user ) => {
        
        if ( err ) return res.status( 500 ).json( err );

        // TODO: check => entry already exists in ratingLog
        
        // write rating log entry
        var ratingLog = new RatingLog( { 
            productid: productid,
            userid: userid,
            like: like,
            dislike: dislike,
        } );

        ratingLog.save().then( ( ratingLog ) => {

            return res.json( ratingLog );         

        }, ( err ) => {

            return res.status( 400 ).json( err );
        
        } );

    } );

};

// GET: answers
exports.getAnswers = ( req, res, next ) => {
  
  RatingLog.find( ).exec( ( err, logs ) => {
    
      if ( err ) return res.status( 500 ).json( err );

      res.json( logs );

  } );

};