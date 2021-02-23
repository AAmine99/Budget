const ExpressError = require('./utils/expressError');
const schemas = require('./schemas')
const Category = require('./models/category')
const Expense = require('./models/expense')
const {validate} =require('./utils/validate')

module.exports.validateCategory = validate(schemas.categorySchema)
module.exports.validateExpense = validate(schemas.expenseSchema)
module.exports.validateRegister = validate(schemas.registerSchema)
module.exports.validateLogin = validate(schemas.loginSchema)
module.exports.validateIncome = validate(schemas.incomeSchema)

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next()
}


module.exports.isCategoryOwner = async (req, res, next) => {
    const {id}= req.params
    const category = await Category.findById(id)
    if(!category.author.equals(req.user._id)){
        req.flash('error','You cant do that')
        return res.redirect('/categories')
    }
    next()
}

module.exports.isExpenseOwner = async (req, res, next) => {
    const {id}= req.params
    const expense = await Expense.findById(id)
    if(!expense.author.equals(req.user._id)){
        req.flash('error','You cant do that')
        return res.redirect('/expenses')
    }
    next()
}


