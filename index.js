require('custom-env').env()
const express = require("express"),
    $ENV = process.env,
    axios = require('axios'),
    AfricasTalking = require('africastalking'),
    app = express(),
    PORT = process.env.PORT || 3000,
    appURL = `${$ENV.appURL}:${$ENV}` || 'http://localhost:3000',
    usersAPIBase = `${appURL}${$ENV.usersAPIBase}` || `http://localhost:3000/users`
africasTalkingAPIKey = $ENV.africasTalkingAPIKey,
    africasTalkingUsername = $ENV.africasTalkingUsername || "swiftscores",
    bodyParser = require('body-parser'),
    liveScores = require('./lib/scores'),
    cors = require('cors'),
    path = require('path'),
    User = require('./controllers/user.controller')

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'projects'));
console.log(app.get('views'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("index");
});

const users = require('./routes/user.route');

app.use('/users', users);

let webURL = 'https://naijahacks-vestub.herokuapp.com/docs'

let welcomeMsg = `CON Hello and Welcome to SwiftScores.`



let orderDetails = {
    name: "",
    description: "",
    address: "",
    telephone: "",
    open: true
}

var lastData = "";

var phoneSessionObject = {}
var lastAction = ''

app.get('/simulator', (req, res) => {

})

app.post('/ussd', (req, res) => {

    var sessionPhone = typeof (req.body.sessionNumber) == 'string' ? req.body.sessionNumber : false

    if (!sessionPhone) {
        res.status(400).json({
            'Error': 'Please provide a session number'
        })
    }
    phoneSessionObject[sessionPhone].action = 'start'


    let serviceCode = req.body.serviceCode
    let phoneNumber = req.body.phoneNumber
    let rawText = req.body.text.split("*")

    // Get the last user input
    let text = rawText[rawText.length - 1]

    let textValue = text.split('*').length

    let message = ''

    if (text === '') {
        // Check if current number is registered
        var lastAction = phoneSessionObject[sessionPhone].action = ''

        axios.get(`${usersAPIBase}${phoneNumber}`).then(result => {
            if (result.status == 200) {
                phoneSessionObject[sessionPhone].action = 'leagueSelect'
                // Get Leaugues
                message = `Please select your preferred league\n`

                // Get leauges
                // liveScores.getCompetition()
                liveScores.getCountries().then(data => {
                    Promise.all(data.map(liveScores.getCompetition)).then(data => {
                        // var new_result = ...data
                        var leagueNames = []
                        var resolved_values = data.map(val => {
                            return val.data
                        })

                        var leagueNames = []
                        var leaguePosition = []

                        for (let v of resolved_values[0]) {
                            leagueNames.push(v.league_name)
                            leaguePosition.push(v)
                        }

                        // Data resolved
                        var mesgStr = leagueNames.reduce((a, b, i) => {
                            return a + `${i+1}. ${b}\n`
                        }, '')
                        // message
                        // console.log(mesgStr)
                        message += mesgStr

                        res.status(200).json({
                            text: message
                        });
                    })

                }).catch(err => {
                    console.log(err)
                })

            } else {
                message = `${welcomeMsg}
                Please enter your phone number to continue. Enter 0 for the current number`
                phoneSessionObject[sessionPhone].action = 'firstname'
            }

        }).catch(err => {
            console.log(err)
            result.status(500).json({
                'Error': 'Cannot get user details'
            })
        })
        welcomeMsg += `
        
        `
        message = welcomeMsg
    } else if (textValue === 1) {
        // Check if current user is registered user
        if (lastAction == 0) {
            let phoneNumber = sessionPhone
        } else {
            let phoneNumber = lastAction.trim()
        }

        axios.get(`${usersAPIBase}${phoneNumber}`).then(result => {
            if (result.status == 404) {
                phoneSessionObject[sessionPhone].action = 'firstname'
                message = 'CON Please enter your First name'
            } else {
                message = 'CON User with this number has already registered.'
            }

        }).catch(err => {
            console.log(err)
            result.status(500).json({
                'Error': 'Cannot get user details'
            })
        })
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


// liveScores.getLeagues()