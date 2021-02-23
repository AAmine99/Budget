const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const income = require('../controllers/income')
const {validateIncome}=require('../middleware')

router.get('/new', income.renderNewForm)

router.route('/')
    .get(catchAsync(income.index))
    .post(validateIncome, catchAsync(income.createIncome))

router.route('/:id')
    .delete(catchAsync(income.deleteIncome))
    .put(validateIncome, catchAsync(income.editIncome))

router.route('/:id/edit')
    .get(catchAsync(income.rendereditFrom))


module.exports = router