const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({

})
// adding username and password
UserSchema.plugin(passLocalMongoose)

module.exports = mongoose.model('User', UserSchema)