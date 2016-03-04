var express = require('express');
var fetch = require('node-fetch');
require('dotenv').load();
var utsData = require('./data/utsData.json');

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

    var news = newsSearch(text).then(function (json) {
        return {
            "title": "News Corp.",
            "results": json
        };
    });

    var uts = utsSearch(text);

    Promise.all([guardian, news, uts]).then(function (values) {
        var result = [];

        for (var i = 0; i < values.length; i++) {
            if (values[i].results.length > 0) {
                result.push(values[i]);
            }
        }
        res.send(result);
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

var newsSearch = function (text) {
    return fetch("http://cdn.newsapi.com.au/content/v2/?api_key=" + process.env.NEWS_KEY + "&query=" + text + " AND contentType:NEWS_STORY")
        .catch(function (err) {
            console.log(err);
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (json) {
            var results = [];

            json.results.map(function (result) {
                if (result.domainLinks[0] !== undefined && result.domainLinks[0].link.indexOf("cdn.newsapi.com.au") < 0) {
                    results.push({
                        title: result.title,
                        url: result.domainLinks[0].link
                    });
                }
            });

            return results;
        })
        .catch(function (err) {
            console.log(err)
        });
}

var utsSearch = function (text) {
    var keywords = text.split(" ");
    var hits = [];

    for (var i = 0; i < utsData.length; i++) {
        var found = {index: i, total: 0, keywords: []};
        for (var j = 0; j < keywords.length; j++) {
            if (utsData[i].Expertise.indexOf(keywords[j]) > -1) {
                found.keywords.push(keywords[j]);
                found.total++;
            }
        }
        if (found.total > 0) {
            found.title = utsData[i].Name;
            found.url = utsData[i]["Source Url"];
            hits.push(found);
        }
    }

    hits.sort(function (a,b) {
        return a.total - b.total;
    });

    return {
        title: "UTS",
        results: hits
    };
};