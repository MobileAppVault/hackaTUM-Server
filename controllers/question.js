var moment = require( 'moment' );
var apn = require('apn');

var User = require( '../models/user' );
var PurchaseLog = require( '../models/purchaseLog' );
var QuestionLog = require( '../models/questionLog' );
var RatingLog = require( '../models/ratingLog' );
var Product = require( '../models/product' );
var User = require( '../models/user' );
                
// POST: question
exports.postQuestion = ( req, res, next ) => {

    // TODO: validation is missing. We know it ;-)
    var userid = req.body.userid; 
    var productid = req.body.productid;

    // get user data
    User.findById( userid ).exec(( err, user ) => {
        
        if ( err ) return res.status( 500 ).json( err );

        // write question log entry
        var question = new QuestionLog( { 
            userid: userid,
            productid: productid,
        } );

        question.save( ).then( ( question ) => {

            sendPushNotificationDemo( question.questionid, productid );
            
            res.json( { 
                    status: "PENDING",
                    message: "send to " + purchasers.length + " purchasers.",
                    questionid: question.id,
                    waitfor: 500
                } );
            
            /*
            // TODO: this part should be exclude in separate service and use mongoose populate ref 
            // query purchasers
            PurchaseLog.find( { productid: productid, userid: userid } ).exec( ( err, purchasers ) => {

                if ( purchasers ) {

                    // loop all purchaser
                    for ( var index in purchasers ) {

                        var purchaser = purchasers[index];

                        // check if purchaser has already rated the product in the past
                        RatingLog.findOne( { productid: purchaser.productid, userid: purchaser.userid } ).exec( ( err, rating ) => {

                            // no rating exists? => send push notification
                            // if ( !rating ) <-- removed for demo purposes
                            sendPushNotification( question.questionid, purchaser.productid, purchaser.userid );

                        } );

                    }

                    // status PENDING -> waiting for purchaser response
                    res.json( { 
                        status: "PENDING",
                        message: "send to " + purchasers.length + " purchasers.",
                        questionid: question.id,
                        waitfor: 500
                    } );
                
                } else {

                    // status DONE -> question done because nobody is there to ask 
                    res.json( { 
                        status: "DONE",
                        message: "no purchaser exists for this product",
                        questionid: question.id,
                        waitfor: 500
                    } );

                }
            
            } );       
            */     

        }, ( err ) => {
            return res.status(400).json(err);
        } );

    } );

};


sendPushNotification = ( questionid, productid, userid ) => {

    Product.findById( productid ).exec( ( err, product ) => { 
        
        var title = ( product ? product.title : 'Product' );

        User.findById( userid ).exec( ( err, user ) => { 
            
            if ( user ) {
                
                var deviceTocken = user.pushid;
                
                var note = new apn.Notification();

                note.expiry = Math.floor( Date.now() / 1000 ) + 3600; // Expires 1 hour from now.
                note.badge = 1;
                note.topic = "com.fittschen.machtSpass";

                note.rawPayload = {
                    aps : {
                        category : "com.fittschen.machtSpass.askForMakesFun",
                        alert : {
                            title : "Macht das Spaß?",
                            subtitle : product.title,
                            body : "Du kannst auswählen, ob " + product.title + " Spaß machen oder nicht und helfe dadurch!",
                        },
                        "mutable-content": 1
                    },
                    data: {
                        "questionid" : questionid,
                        "userid" : userid,
                        "image-url": product.image
                    }
                };
                
                apnProvider.send( note, deviceTocken ).then( ( result ) => {
                    console.log( JSON.stringify( result ) );
                } );

                /*
                notificationHubService.apns.createTemplateRegistration(
                    'XXX',
                    'tag', {
                        'aps': {
                            'alert': '$(message)',
                            'badge': '#(count)',
                            'sound': 'default'
                        }
                    },
                    (err, response) => {
                        if ( err ) return;
                        console.log(err);
                        console.log(response);
                        
                        var notification = {
                            'message': 'Macht das Spaß?', // message to display in notification 
                            'count': 1 // set badge iOS badge to this value 
                        };
                        
                        var payload={
                            alert: 'Hello!'
                        };
                        notificationHubService.apns.send(null, payload, function(error){
                            if(!error){
                                // notification sent
                            }
                        });

                        notificationHubService.send( 'tag', notification, ( err, response ) => {
                            console.log(err);
                            console.log(response);
                        } );

                    }
                );
                */

            }

        });

    });

}

// GET: question/:id
exports.getQuestion = ( req, res, next ) => {

    // query question by id
    QuestionLog.findById( req.params.id ).exec( ( err, question ) => {

        if ( err ) return res.status( 500 ).json( err );

        if ( question ) {

            // get product data
            Product.findById( question.productid ).exec ( ( err, product ) => {

                if ( err ) return res.status( 500 ).json( err );

                res.json( { 
                    questionid: question.id,
                    product: product
                } );

            } );

        } else {
            res.status( 500 ).json( { status: "NOT_FOUND", message: "question not found." } )
        }

    } ); 
};


// GET: question/:id/status
exports.getQuestionStatus = ( req, res, next ) => {

    // query question by id
    QuestionLog.findById( req.params.id ).exec( ( err, question ) => {

        if ( err ) return res.status( 500 ).json( err );

        // check if the new ratings for the specific time window
        
        // get likes
        RatingLog.count( { "createdAt": { "$gt": question.createdAt }, "productid": question.productid, "like": true }, ( err, countLike ) => {
            
            // get dislikes
            RatingLog.count( { "createdAt": { "$gt": question.createdAt }, "productid": question.productid, "like": true }, ( err, countDislike ) => { 

                countLike = (countLike ? countLike : 1);
                countDislike = (countDislike ? countDislike : 0);

                var funfactor = (countLike / 100) * (countLike + countDislike) * 100;
                
                res.json( { 
                    status: "OK",
                    message: "",
                    questionid: question.id,
                    likes: countLike,
                    dislikes: countDislike,
                    funfactor: funfactor
                } );

            });

        });

    } ); 
};


// GET: questions
exports.getQuestions = ( req, res, next ) => {
  
  Question.find( ).exec( ( err, questions ) => {
    
      if ( err ) return res.status( 500 ).json( err );

      res.json( questions );

  } );

};