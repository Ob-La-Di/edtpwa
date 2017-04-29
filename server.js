var express = require('express');
var app = module.exports = express();
var path = require("path");
var request = require('request');
var parser = require('xml-parser');

app.use(express.static(path.join(__dirname,'/')));

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/../index.html');
// });

// app.get('/annuaire.js', function(req, res) {
//     res.sendFile(__dirname + '/../annuaire.js');
// });

app.get('/edt', function(req,res,next){
    request('http://adelb.univ-lyon1.fr/direct/gwtdirectplanning/rss?projectId=3&resources=9767,33140,33141,33142,33143,33144,36476,36477,36478&cliendId=1493454139688&nbDays=15&since=0', function(err, result) {
        var xmlResult = result.body;
        if(!xmlResult){
            return res.status(500).send('An error occured');
        }
        res.json(xmlResult);

    });
});

app.listen(process.env.PORT || 9200, function () {
    console.log('server started');
});