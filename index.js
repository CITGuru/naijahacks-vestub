require('pretty-error').start();

require('custom-env').env()

const express = require("express"),
    $ENV = process.env,
    axios = require('axios'),
    AfricasTalking = require('africastalking'),
    app = express(),
    PORT = process.env.PORT || 3000,
    appURL = `${$ENV.appURL}:${$ENV.PORT}` || 'http://localhost:3000',
    usersAPIBase = `${appURL}${$ENV.usersAPIBase}` || `http://localhost:3000/users`,
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


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render("index", {
        "title": "Homepage"
    });
});

app.get('/simulator', (req, res) => {
    res.render("simulator", {
        "title": "USSD Mobile Simulator"
    })
})

app.post('/simulator/ussd', (req, res) => {
    let session_number = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    res.render("ussd", Object.assign({
        "title": "USSD Mobile Simulator",
        "sessionNumber": session_number
    }, req.body))
})

app.get('/simulator/ussd', (req, res) => {
    res.redirect("/simulator")
})
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
var userCred = {}

app.post('/ussd', (req, res) => {


    var sessionNumber = typeof (req.body.sessionNumber) == 'string' ? req.body.sessionNumber : false

    if (!sessionNumber) {
        res.status(400).json({
            'Error': 'Please provide a session number'
        })
    }
    phoneSessionObject[sessionNumber] = phoneSessionObject[sessionNumber] || {}


    var serviceCode = req.body.serviceCode
    var phoneNumber = req.body.phoneNumber
    var rawText = req.body.text.split("*")

    // Get the last user input
    var text = rawText[rawText.length - 1]

    var textValue = text.split('*').length

    var message = ''
    // res.send(phoneSessionObject)

    if (text === '') {
        axios.get(`${usersAPIBase}${phoneNumber}`).then(result => {
            phoneSessionObject[sessionNumber].action = 'leagueSelect'
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

        }).catch(err => {
            console.log(err)

            if (err.response.status == 404) {
                message = `${welcomeMsg}
                    Please enter your phone number to continue. Enter 0 for the current number`
                phoneSessionObject[sessionNumber].action = 'phone'

                console.log(phoneSessionObject[sessionNumber])

                res.status(200).json({
                    'text': message
                })
            } else {
                phoneSessionObject[sessionNumber].action = 'phone'
                result.status(500).json({
                    'Error': 'Cannot get user details'
                })
            }

        })
    } else {
        console.log(phoneSessionObject[sessionNumber])
    }
    
     if (phoneSessionObject[sessionNumber].action == 'phone') {
        var text = text.trim()
        // console.log('yes')
        if (text != 0) {
            var phone = text
            if (!phone.match(/\+?[0-9]{5,15}/igm)) {
                phoneSessionObject[sessionNumber].action = 'phone'
                res.send({
                    'text': "Please provide a valid phone number"
                });
            }
        } else {
            var phone = phoneNumber
        }
        axios.get(`${usersAPIBase}${text}`).then(res => {
            phoneSessionObject[sessionNumber].action = 'phone'
            res.send({
                'text': "Phone number already used, please provide another"
            });
        }).catch(err => {
            if (err.response.status == 404) {
                // User does not exits
                // Process registration
                userCred[sessionNumber] = userCred[sessionNumber] || {}

                userCred[sessionNumber].phone = phone

                phoneSessionObject[sessionNumber].action = 'name'

                res.send({
                    text: "Please provide your full name"
                });

            } else {
                result.status(500).json({
                    'Error': 'Cannot get user details'
                })
            }
        })
    }
    // res.contentType('text/plain');
    // // console.log(req.body)
    // res.status(200)
    //     .send(message)
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

// axios.get(`${usersAPIBase}08099479437`).then(result => {
//     console.log(result)
// })