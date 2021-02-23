const Expense = require('../models/expense')
const Category = require('../models/category')

module.exports.renderNewForm = async (req, res) => {
    const categories = await Category.find({ author: req.user._id })
    res.render('expenses/new', { categories })
}

module.exports.createExpense = async (req, res) => {
    const { category } = req.body.expense
    const findCat = await Category.find({ name: category })
    if (!findCat || !category) {
        req.flash('error', 'Cannot find that category')
        return res.redirect(`/expenses/new`)
    }
    const expense = new Expense({ ...req.body.expense });
    expense.author = req.user._id
    await expense.save()
    req.flash('success', 'Successfully made a new expense')
    res.redirect('/expenses')
}

module.exports.index = async (req, res) => {
    let { p } = req.params || 0
    p = parseInt(p) 
    let skip =0
    for(let i =1;i<p;i++){
        skip = skip+10
    }
    const count = await Expense.estimatedDocumentCount()
    const pages = count/10
    let expenses = await Expense.find({ author: req.user._id }).skip(skip).limit(10).populate('category')
    res.render('expenses/index', { expenses, pages })
}

module.exports.rendereditFrom = async (req, res) => {
    const { id } = req.params
    const expense = await Expense.findById(id).populate('category')
    if (!expense) {
        req.flash('error', 'Cannot find that expense')
        return res.redirect(`/expenses`)
    }
    const categories = await Category.find({ author: req.user._id })
    res.render('expenses/edit', { expense, categories })
}

module.exports.editExpense = async (req, res) => {
    const { id } = req.params
    const expense = await Expense.findByIdAndUpdate(id, { ...req.body.expense });
    await expense.save()
    req.flash('success', 'Successfully updated a new expense')
    res.redirect('/expenses')
}

module.exports.deleteExpense = async (req, res) => {
    const expense = await Expense.findByIdAndDelete(req.params.id)
    if (!expense) {
        req.flash('error', 'Cannot find that expense')
        return res.redirect(`/expenses`)
    }
    res.redirect('/expenses')
}




