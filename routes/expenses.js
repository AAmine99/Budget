const express = require('express');
const router = express.Router();
const expense = require('../controllers/expenses')
const catchAsync = require('../utils/catchAsync')
const { validateExpense } = require('../middleware')

router.get('/new', catchAsync(expense.renderNewForm))

router.route('/')
    .get(catchAsync(expense.index))
    .post(validateExpense, catchAsync(expense.createExpense))
    
router.get('/:p',catchAsync(expense.index))

router.route('/:id')
    .put(validateExpense, catchAsync(expense.editExpense))
    .delete(catchAsync(expense.deleteExpense))

router.route('/:id/edit')
    .get(catchAsync(expense.rendereditFrom))


module.exports = router