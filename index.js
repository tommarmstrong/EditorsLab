var express = require('express');
var fetch = require('node-fetch');
require('dotenv').load()
var utsData = JSON.parse(require('data/utsData.json'));


var app = express();

app.get("/search", function (req,res) {

    var text = req.query.q;

    console.log("Search for", text);

    var guardian = guardianSearch(text).then(function (json) {
        return {
            "title": "The Guardian",
            "results": json
        };
    });

    Promise.all([guardian]).then(function (values) {
        res.send(values);
    });
});

app.use(express.static("app"));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

var guardianSearch = function (text) {
    return fetch("http://content.guardianapis.com/search?q=" + text +"&api-key=" + process.env.GUARDIAN_KEY)
        .catch(function (err) {
            console.log(err);
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (json) {
            var results = [];

            json.response.results.map(function (result) {
               results.push({
                   title: result.webTitle,
                   url: result.webUrl
               });
            });

            return results;
        });
};

var utsSearch = function (text) {
    var keywords = text.split(" ");
    var hits = [];

    for (var i = 0; i < utsData.length; i++) {
        hits.push({i: 0});
        for (var j = 0; j < keywords.length; j++) {
            if (utsData[i].Expertise.indexOf(keywords[j]) > -1) {
                hits[i]++;
            }
        }

    }

    console.log(JSON.stringify(hits))
};