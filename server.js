var express = require('express'),
    app = express(),
    mongojs = require('mongojs'),
	db = mongojs('mongodb://localhost/concerts', ['concerts']);



app.use(express.static(__dirname+'/'));


//Partie renvoyant les données de concert

app.get('/concert', function(req, res){
	db.concerts.find({}, function(err, concert) {
		res.send(concert);
	});
});

//Partie Mettant a jour la base de données en creant le fichier concert.json et en inserant les datas

app.get('/maj', function(req, res){

		var fs = require('fs');

var request = require('request');
var util = require('util');

var url = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&location=madrid&api_key=dbc287366d92998e7f5fb5ba6fb7e7f1&format=json';

request(url, function(err, res, results) {
    //chunk to store info captured from LastFm
    var chunk= '';
    //var to store parsed chunk info
    var parsedJSON = '';
    //var to store each parsed selection (object) from captured info
    var myobject = '';
    //storing all useful information on concerts
    var parsedChunk = '';
    //storing concert information on jsonObj
    var jsonObj = {};
    //creating output file to save json
    var outputFileName = './concert.json';
    //variable for storing stringify JSON
    var jsonStringify = '';
    
    if(!err){
        //console.log(results);
        chunk += results;
        parsedJSON = JSON.parse(chunk);
        
        var length;
        length = (parsedJSON.events.event).length;
        //console.log('length: ' + length);
        
        //creating JSON
        jsonObj.events = {};
        jsonObj.events.event = [];
        for(i =0; i<length; i++){
        myobject = parsedJSON.events.event[i];

        //adding data to concert.JSON
        jsonObj.events.event.push({
            id : myobject.id,
            title : myobject.title,
        artist : myobject.artists.artist,
        address : {name: myobject.venue.name, street : myobject.venue.location.street, postalcode : myobject.venue.location.postalcode,
                    city : myobject.venue.location.city, country : myobject.venue.location.country,
                    'geo:point' : { 'geo:lat' : myobject.venue.location['geo:point']['geo:lat'], 'geo:long' : myobject.venue.location['geo:point']['geo:long']}},
                    url : myobject.url,
                    startDate : myobject.startDate,
                    website : myobject.website
        });
        

        
  
        
        //jsonObj contains some information in json (non-stringify-d)
        //jsonStringify stores stringify-d jsonObj
        jsonStringify = JSON.stringify(jsonObj, null, 4);
        //console.log(jsonStringify);
        
        };
                
        //writing them into file
        fs.writeFile(outputFileName, jsonStringify, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("JSON saved to " + outputFileName);
    }
        });
        
        
        //exporting stringify-d jsonObj
        exports.jsonStringify = jsonStringify;
        //exporting concert information

        //console.log('json req-json-lastfm: ' + jsonStringify);
    }
    else 
    console.log('\n ***error occured in req-json-lastfm.js***');
});
		
//importing concert.json file
var concert = require('./concert');

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

//establishing new connection
var client = new Db('concerts', new Server('127.0.0.1', 27017), {safe:false});

//function to insert data into default collection
var insertData = function(err, collection){
    //collection.insert({name: 'something'});
    collection.insert({'concert' : concert});
};

//function to list all data in default collection
var listAllData = function(err, collection){
    collection.find().toArray(function(err, results){
        console.log(results);
        client.close();
    });
};

//opening dataBase 
client.open(function(err,pClient){
    if(!err){
        //console.log('jsonObj: ' + jsonObj);
        //console.log('jsonExp: ' + jsonExp);
        //console.log('concert: ' + concert);
        //calling function insertData on collection 'test'
        client.collection("lesconcerts", insertData);
        //calling fucntion listAllDta on collection 'test'
        client.collection('lesconcerts', listAllData);    
    }
    else console.log('\n ***error occured in node-mongodb.js***');
});



		res.send("mise a jour de la base effectuée avec succes");
	});

app.listen(3000);