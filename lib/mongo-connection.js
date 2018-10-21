const mongoose = require('mongoose'),
DBAutoIncrement = require('mongoose-auto-increment'),
MONGODBI_URI = process.env.MONGODBI_URI || 'mongodb:localhost/swiftscore',
Schema = mongoose.Schema


mongoose.connect(MONGODBI_URI);
mongoose.Promise = global.Promise;
let connection = mongoose.createConnection(`${MONGODBI_URI}`, {
    useNewUrlParser: true
})
