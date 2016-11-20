var express = require( 'express' );
var bodyParser = require('body-parser')
var mongoose = require( 'mongoose' );
var dotenv = require( 'dotenv' );
//var azure = require( 'azure' ); -> because Azure was not working with the certificate 
var apn = require('apn');

// Load environment variables from .env file
dotenv.load();

// Controllers
var mainController = require( './controllers/main' );
var profileController = require( './controllers/profile' );
var setupController = require( './controllers/setup' );
var productController = require( './controllers/product' );
var questionController = require( './controllers/question' );
var answerController = require( './controllers/answer' );
var ratingController = require( './controllers/rating' );

// Connect to mongodb
mongoose.connect( process.env.MONGODB );
mongoose.connection.on( 'error', ( err ) => {
  console.log( 'MongoDB Connection Error. Please make sure that MongoDB is running. ' + process.env.MONGODB );
  console.log( err );
  process.exit( 1 );
} );

// express
var app = express( );

// add express middleware
app.use( bodyParser.json( ) ); // for parsing application/json

// set express port
app.set( 'port', process.env.PORT || 3000 );

// setup Azure Notification Hub service
// notificationHubService = azure.createNotificationHubService( process.env.AZURE_HUB_NAME, process.env.AZURE_HUB_CONNECTION_STRING );

apnProvider = new apn.Provider( {
  key: process.env.APN_PUSH_KEY_PATH,
  cert: process.env.APN_PUSH_CERT_PATH,
  passphrase: process.env.APN_PUSH_PHRASE,
  production: ( process.env.APN_PUSH_ENV === 'production' ? true : false )
} );

// API
app.get( '/', mainController.index );
app.get( '/api/v1/fakedata', setupController.getFakeData );
app.get( '/api/v1/dropall', setupController.getDropAll );

// user profile
app.get( '/api/v1/profiles', profileController.getProfiles );
app.get( '/api/v1/profile/:id', profileController.getProfile );
app.post( '/api/v1/profile', profileController.postProfile );
app.put( '/api/v1/profile/:id', profileController.putProfile );

// product
app.post( '/api/v1/product', productController.postProductDetails );
app.get( '/api/v1/products', productController.getProducts );

// question
app.get( '/api/v1/questions', questionController.getQuestions );
app.get( '/api/v1/question/:id', questionController.getQuestion );
app.get( '/api/v1/question/:id/status', questionController.getQuestionStatus );
app.post( '/api/v1/question', questionController.postQuestion );

// answer
app.get( '/api/v1/answers', answerController.getAnswers );
app.post( '/api/v1/answer', answerController.postAnwser );

// rating
app.get( '/api/v1/ratings', ratingController.getRatings );

app.get ( '/api/v1/demo', setupController.demoProducts );

// Start express and listen to port ( default: 3000 )
app.listen( app.get( 'port' ), () => {
  console.log( 'Express server listening on port ' + app.get( 'port' ) );
} );
