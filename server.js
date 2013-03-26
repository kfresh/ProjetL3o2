var util = require('util');

var express = require('express'),
    app = express(),
    mongojs = require('mongojs'),
	db = mongojs('mongodb://localhost/test', ['test']);

app.use(express.static(__dirname+'/'));
console.log('Starting server...');
console.log('server listening on port 3000');

app.get('/concert', function(req, res){
	db.test.find({ latlong : {$near:[parseFloat(req.query.lat), parseFloat(req.query.long)] , $maxDistance: parseFloat(req.query.rayon)/111.12}}, function(err, concert) {
		res.send(concert);
	}).limit(3000);
});

app.get('/test', function(req, res){

        res.send(req.query.id);
    
});
//Partie Mettant a jour la base de données en creant le fichier concert.json et en inserant les datas

app.get('/maj', function(req, res){
	var requestLastfm = require('../req-json-lastfm');
	res.send("mise a jour de la base a était lancé avec succes");
	});
app.listen(3000);