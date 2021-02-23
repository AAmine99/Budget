const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Expense = require('../models/expense');
const Category = require('../models/category');
const Income = require('../models/income');

router.get('/', catchAsync(async (req, res) => {
    const current= new Date()
    const month = current.getMonth()
    const income = await Income.findOne({author:req.user._id, month:month})
    if(!income){
        req.flash('error','you need the income of the current month')
        return res.redirect('/incomes/new')
    }
    const expense = new Expense({})
    const dashboard = await expense.dash(req.user._id, Category)
    const saving = await expense.saving(req.user._id,Income)
    Object.assign(dashboard, {income:income.amount},{saving:saving})
    res.render('dashboard/dash', dashboard)
}))


module.exports = router