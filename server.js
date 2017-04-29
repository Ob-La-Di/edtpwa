var express = require('express');
var app = module.exports = express();
var path = require("path");
var request = require('request');
var striptags = require('striptags');
var parseString = require('xml2js').parseString;
var moment = require('moment');
app.use(express.static(path.join(__dirname,'/')));

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/../index.html');
// });

// app.get('/annuaire.js', function(req, res) {
//     res.sendFile(__dirname + '/../annuaire.js');
// });

var cleanXML = function(items) {
    for(var i in items){
        var removedTags = striptags(items[i].description[0]),
        year = removedTags.substr(6,4),
        month = removedTags.substr(3,2),
        day = removedTags.substr(0,2),
        spaceIndex = items[i].description[0].indexOf(' '),
        tagIndex = items[i].description[0].indexOf('</p>'),


        date = moment(year+'-'+month+'-'+day),
        period = items[i].description[0].substr(spaceIndex+1, tagIndex - spaceIndex),
        begin = period.substr(0,5),
        end = period.substr(8,5);
        
        console.log(date, begin, end, items[i].description[0]);

    }
}



app.get('*',function(req,res,next){
    if(process.env.NODE_ENV !== 'prod') return;

    if(req.headers['x-forwarded-proto']!='https')
        res.redirect('https://edtlyon1.herokuapp.com/'+req.url)
    else
        next();
})



app.get('/edt', function(req,res,next){
    request('http://adelb.univ-lyon1.fr/direct/gwtdirectplanning/rss?projectId=3&resources=9767,33140,33141,33142,33143,33144,36476,36477,36478&cliendId=1493454139688&nbDays=15&since=0', function(err, result) {
        var xmlResult = result.body;
        if(!xmlResult){
            return res.status(500).send('An error occured');
        }
        parseString(xmlResult, function (err, result) {
            cleanXML(result.rss.channel[0].item);
            res.json(result.rss.channel[0].item);
        });

    });
});

app.listen(process.env.PORT || 9200, function () {
    console.log('server started');
});