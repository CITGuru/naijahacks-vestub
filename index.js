const express = require("express");
const AfricasTalking = require('africastalking');
const app = express();

const PORT = process.env.PORT || 3000;

const africasTalkingAPIKey = "886fb8ccbed537bfb4a7e552588cfc91c40116728c63b9f342dc05727043ea69"
const africasTalkingUsername = "swiftscores",
    liveScores = require('./lib/scores')

app.set("port", PORT);

const gateway = AfricasTalking({
    username: africasTalkingUsername,
    apiKey: africasTalkingAPIKey
});

const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));
app.set('public', path.join(__dirname, 'public'));
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render("index");
});

var webURL = 'https://naijahacks-vestub.herokuapp.com/docs'
var welcomeMsg = `CON Hello and Welcome to SwiftScore.
It seems you are a new customer.
Please find our docs here ${webURL}
Enter your name to continue`

var orderDetails = {
    name: "",
    description: "",
    address: "",
    telephone: "",
    open: true
}
var lastData = "";

app.post('/ussd', (req,res) => {
    console.log(req.body)
    res.status(200)
    .send(req.body)
})

app.use(function(req, res){
    res.type("text/plain"),
        res.status(404);
    res.send('404 - Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(app.get('port'), () => {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});


liveScores.getCompetition('169')