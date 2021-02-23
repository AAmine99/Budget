const mongoose = require('mongoose')
const Schema = mongoose.Schema

const expenseSchema = new Schema({
    name: String,
    date:
    {
        type: Date,
        default: new Date()
    },
    amount: Number,
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
});


expenseSchema.methods.sum = async (month, userId) => {
    const Expense = mongoose.model('Expense', expenseSchema);
    const current = new Date
    const currentYear = current.getFullYear()
    const expenses = await Expense.find({
        date: {
            $gte: new Date(currentYear, month, 0),
            $lt: new Date(currentYear, month, 31)
        },
        author: userId
    })
    return expenses.reduce((acc, ex) => acc + ex.amount, 0)
}
expenseSchema.methods.sumYear = async (userId) => {
    const Expense = mongoose.model('Expense', expenseSchema);
    const expense = new Expense()
    const expensesYear = []
    for (let i = 0; i <= 11; i++) {
        expensesYear.push(await expense.sum(i, userId))
    }
    return expensesYear
}
expenseSchema.methods.dash = async (userId, Category) => {
    const Expense = mongoose.model('Expense', expenseSchema);
    let expense = new Expense({})
    //get current month expense
    const current = new Date
    const currentMonth = current.getMonth()
    const thisMonthSum = await expense.sum(currentMonth, userId)
    //get current year expenses per month
    const year = await expense.sumYear(userId)
    //get amount of each category
    const yearSum = year.reduce((acc, x) => acc + x, 0)
    let catsAmounts = []
    let catsNames = []
    let other = 0
    const categories = await Expense.aggregate([
        { $match: { author: userId } },
        { $group: { _id: '$category', amount: { $sum: '$amount' } } },
        { $sort: { amount: -1 } }
    ])
    if (categories.length > 0) {
        await Category.populate(categories, { path: '_id', select: 'name' })
        for (let i = 0; i < categories.length; i++) {
            catsAmounts.push(categories[i].amount)
            catsNames.push(categories[i]._id.name)
            if (i === 2) {
                break
            }
        }
        const other = yearSum - catsAmounts.reduce((acc, x) => acc + x)
        const dashboard = { thisMonthSum, year, yearSum, catsAmounts, catsNames, other }
        return dashboard
    }
    else {
        return { thisMonthSum, year, yearSum, catsAmounts, catsNames, other }
    }
}


expenseSchema.methods.saving = async (userId, Income) => {
    const Expense = mongoose.model('Expense', expenseSchema);
    const expense = new Expense({})
    const incomes = await Income.aggregate([
        { $match: { author: userId } },
        { $sort: { month: 1 } }
    ])
    let saving = 0
    for ( let i=0;i < incomes.length;i++){
        let exs = await expense.sum(incomes[i].month,userId)
        saving= saving + (incomes[i].amount - exs)
    }
    return saving
}
module.exports = mongoose.model('Expense', expenseSchema)