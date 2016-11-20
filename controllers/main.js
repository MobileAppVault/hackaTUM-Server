exports.index = ( req, res, next) => {
  res.send( ''+
  '<div style="color:#df0000;text-align:center"><h1>Hauptsache es macht Spaß!</h1></div>'+
  '<div style="color:#8CD790;text-align:center"><h2>Express server is up and running!</h2></div>'+
  '' );
};
