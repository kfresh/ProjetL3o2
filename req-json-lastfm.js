#!/usr/bin/env node

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
 

        
        //adding data to JSON
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
