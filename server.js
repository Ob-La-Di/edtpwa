var express = require('express');
var app = module.exports = express();
var path = require("path");
var request = require('request');
var striptags = require('striptags');
var parseString = require('xml2js').parseString;
var moment = require('moment');
var sslRedirect = require('heroku-ssl-redirect');
var Promise = require('bluebird');
var _ = require('lodash');

app.use(sslRedirect());
var build=(process.env.NODE_ENV === 'production') ?  '/build/default': '/' ;
console.log(build);
app.use(express.static(path.join(__dirname,build)));

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/../index.html');
// });

// app.get('/annuaire.js', function(req, res) {
//     res.sendFile(__dirname + '/../annuaire.js');
// });

var cleanXML = function(items) {
    return new Promise(function(resolve, reject) {

        var edt = {};

        for(var i in items){
            var removedTags = striptags(items[i].description[0]),
            spaceIndex = items[i].description[0].indexOf(' '),
            tagIndex = items[i].description[0].indexOf('</p>'),

            date = moment(removedTags.substr(0,10), 'DD/MM/YYYY');
            period = items[i].description[0].substr(spaceIndex+1, tagIndex - spaceIndex-1),
            begin = moment.utc(removedTags.substr(0,10)+' '+period.substr(0,5).replace('h', ':'), 'DD/MM/YYYY HH:mm'),
            end = moment.utc(removedTags.substr(0,10)+' '+period.substr(8,5).replace('h', ':'), 'DD/MM/YYYY HH:mm'),
            description = items[i].description[0].substr(57).replace('M1 Informatique', '').replace(/<br ?\/>/gi, '\n').replace(items[i].title[0].replace(' TP', ''), '').replace('grA', '');

            if(!edt[date.format('YYYY-MM-DD')]){
                edt[date.format('YYYY-MM-DD')] = [];
            }
            edt[date.format('YYYY-MM-DD')].push({
                title:  items[i].title[0],
                description: description,
                period: period,
                begin: begin,
                end: end
            });
        }

        var realResult = [];
        for(var i in edt){
            edt[i] = _.sortBy(edt[i], function(o) { return o.begin});
            realResult.push([i, edt[i]]);
        }

        realResult = _.sortBy(realResult, function(o){
            return o[0];
        });

        return resolve(realResult);
    });
}

app.get('/edt', function(req,res,next){
    request('http://adelb.univ-lyon1.fr/direct/gwtdirectplanning/rss?projectId=3&resources=9767,33140,33141,33142,33143,33144,36476,36477,36478&cliendId=1493454139688&nbDays=15&since=0', function(err, result) {
        var xmlResult = result.body;
        if(!xmlResult){
            return res.status(500).send('An error occured');
        }
        parseString(xmlResult, function (err, result) {
            cleanXML(result.rss.channel[0].item).then(function(edt) {
                res.json(edt);
            }).catch(function(err){
                res.status(500).send(err);
            });
            // res.json(result.rss.channel[0].item);
        });

    });
});

app.listen(process.env.PORT || 9200, function () {
    console.log('server started');
});