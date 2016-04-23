var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    assert = require('assert');

app.use(express.static(__dirname + '/public'));
app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true })); 

function errorHandler(err, req, res, next) {// Handler for internal server errors

    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err });
}

MongoClient.connect('mongodb://localhost:27017/HackerTeam', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    //Add a route to /show_movies
    
    app.get('/', function(req, res, next){
        db.collection("events").find({}).toArray(function(err,docs){
            res.render("show_events", {'events':docs});
        })
    });

    app.get('/add_event', function(req, res, next){
        res.render("add_event");
    });

    app.post('/add_event', function(req, res, next) {
        var name = req.body.name;
        var location = req.body.location;
        var date = req.body.date;
        if (name =='' || location == '' || date == '') {
            next('Please provide an entry for all fields');
        }
        else {
            db.collection("events").insertOne(
                {"name":name, "location":location, "date":date, "need_group":[],"need_more":[]},
                function (err, r) {
                    assert.equal(null, err);
                    db.collection("events").find({}).toArray(function(err,docs){
                        res.render("show_events", {'events':docs});
                    })
                }
            );
        }
    });

    app.use(errorHandler);
    
    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

});