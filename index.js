const express = require("express"),
    $ENV = process.env,
    axios = require('axios'),
    AfricasTalking = require('africastalking'),
    app = express(),

    PORT = process.env.PORT || 3000,

    africasTalkingAPIKey = $ENV.africasTalkingAPIKey || "886fb8ccbed537bfb4a7e552588cfc91c40116728c63b9f342dc05727043ea69",
    africasTalkingUsername = $ENV.africasTalkingUsername || "swiftscores",
    bodyParser = require('body-parser'),
    liveScores = require('./lib/scores'),
    cors = require('cors'),
    path = require('path')

app.set("port", PORT);

app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());





const gateway = AfricasTalking({
    username: africasTalkingUsername,
    apiKey: africasTalkingAPIKey
});


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

app.post('/ussd', (req, res) => {


    var sessionId = req.body.sessionId
    var serviceCode = req.body.serviceCode
    var phoneNumber = req.body.phoneNumber
    var text = req.body.text
    var textValue = text.split('*').length

    let message = ''

    if (text === '') {
        message = welcomeMsg
    } else if (textValue === 1) {
        message = "CON What do you want to eat?"
        orderDetails.name = text;
    } else if (textValue === 2) {
        message = "CON Where do we deliver it?"
        orderDetails.description = text.split('*')[1];
    } else if (textValue === 3) {
        message = "CON What's your telephone number?"
        orderDetails.address = text.split('*')[2];
    } else if (textValue === 4) {
        message = `CON Would you like to place this order?
        1. Yes
        2. No`
        lastData = text.split('*')[3];
    } else {
        message = `END Thanks for your order
        Enjoy your meal in advance`
        orderDetails.telephone = lastData
    }
    res.contentType('text/plain');
    // console.log(req.body)
    res.status(200)
        .send(message)
})

app.use(function (req, res) {
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


// liveScores.getCompetition('169')