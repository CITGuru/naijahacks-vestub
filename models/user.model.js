const mongoose = require('mongoose'),
Schema = mongoose.Schema,
MONGODBI_URI = $ENV.MONGODBI_URI || 'mongodb:localhost/scoreDB',
DBAutoIncrement = require('mongoose-auto-increment')

// Connect to database
let connection = mongoose.createConnection(`${MONGODBI_URI}`, {
    useNewUrlParser: true
})

// Initialize DB auto increment
DBAutoIncrement.initialize(connection)

let UserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, max: 255 },
    phone: { type: String, required: true, max: 255 },
    date: { type: Date, default: Date.now }
});

UserSchema.plugin(DBAutoIncrement.plugin, {
    model: 'User',
    field:'id',
    startAt: 1
})

module.exports = mongoose.model('User', UserSchema);