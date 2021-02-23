const mongoose = require('mongoose')
const Category = require('../models/category')
const User = require('../models/user')
const Expense = require('../models/expense')
const Income = require('../models/income')


mongoose.connect('mongodb://localhost:27017/prs-budget', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database connected')
});

const seed = async () => {
    // await Category.deleteMany({})
    await Expense.deleteMany({})
    // await User.deleteMany({})
    // await Income.deleteMany({})
    for(let i=1; i<40;i++){
        const expense = new Expense({
            name: `example ${i}`,
            date: new Date(),
            category:'6034338a61a5cc14875ef623',
            author:'60342bf4bd7ce01224c7cece',
            amount:10
        })
        await expense.save()
    }
}

seed().then(() => {
    mongoose.connection.close()
})

