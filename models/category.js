const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Expense = require('./expense')
const categorySchema = new Schema({
    name: String,
    lastModified:
    {
        type: Date,
        default: new Date()
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
});

categorySchema.post('findOneAndDelete',async function(doc){
    if (doc) {
        await Expense.deleteMany({ category: { $in: doc._id } })
    }
})


module.exports= mongoose.model('Category', categorySchema)