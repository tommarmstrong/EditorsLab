var express = require('express');
var fetch = require('node-fetch');
require('dotenv').load()

var app = express();

app.get("/search", function (req,res) {

    var text = req.query.q;

    console.log("Search for", text);

    guardianSearch(text).then(function (json) {
        res.send(json);
    });
});

app.use(express.static("app"));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

var guardianSearch = function (text) {
    return fetch("http://content.guardianapis.com/search?q=" + text +"&api-key=" + process.env.GUARDIAN_KEY)
        .then(function (res) {
            return res.json();
        })
}