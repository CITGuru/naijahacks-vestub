const express = require("express");
const AfricasTalking = require('africastalking');
const app = express();

const PORT = process.env.PORT || 3000;

const africasTalkingAPIKey = "886fb8ccbed537bfb4a7e552588cfc91c40116728c63b9f342dc05727043ea69"
const africasTalkingUsername = "swiftscores"

app.set("port", PORT);

const gateway    = AfricasTalking({ username: africasTalkingUsername, apiKey: africasTalkingAPIKey });

console.log(gateway.USSD)
// console.log(JSON.stringify(gateway.USSD))

const path = require('path');

app.use(express.static(path.join(__dirname, 'src')));
app.set('src', path.join(__dirname, 'src'));
app.set('view engine', 'html');

app.get('/', function(req, res){
    res.render("index");
});

app.use(function(req, res){
    res.type("text/plain"),
    res.status(404);
    res.send('404 - Not Found');
});
    
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
