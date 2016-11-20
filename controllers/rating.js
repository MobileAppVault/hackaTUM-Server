var RatingLog = require( '../models/ratingLog' );

// GET: ratings/?page=2&limit=10
exports.getRatings = ( req, res, next ) => {

  var limit = ( req.query.limit ? req.query.limit : 20 )
  var skip = ( req.query.page ? limit * req.query.page : 0 );
   
  RatingLog.find( )
  .limit(limit)
  .skip(skip)
  .exec( ( err, logs ) => {
    
      if ( err ) return res.status( 500 ).json( err );

      res.json( logs );

  } );

};