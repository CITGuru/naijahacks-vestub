const mongoose = require('mongoose'),
DBAutoIncrement = require('mongoose-auto-increment'),
MONGODBI_URI = process.env.MONGODBI_URI || 'mongodb://localhost:27017/swiftscore',
Schema = mongoose.Schema
mongoose.connect(MONGODBI_URI, {
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;
const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

DBAutoIncrement.initialize(connection)

let UserSchema = new Schema({
    name: { type: String, required: true, max: 255 },
    phone: { type: String, required: true, max: 20, unique:true },
    date: { type: Date, default: Date.now }
});

UserSchema.plugin(DBAutoIncrement.plugin, {
    model: 'User',
    field:'id',
    startAt: 1
})

module.exports = mongoose.model('User', UserSchema);