const mongoose = require('mongoose')
const Schema = mongoose.Schema

const incomeSchema = new Schema({
    amount: Number,
    month : Number,
    author: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Income', incomeSchema)