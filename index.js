var express = require('express');
var app = express();

app.get("/search", function (req,res) {
    console.log("Search for", req.query.q);
    res.send(req.query.q);
});

app.use(express.static("app"));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});