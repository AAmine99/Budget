const express = require('express');
const router = express.Router();
const category = require('../controllers/categories')
const catchAsync = require('../utils/catchAsync')
const { validateCategory, isCategoryOwner } = require('../middleware')


router.get('/new',  category.renderNewForm)

router.route('/')
    .get(catchAsync(category.index))
    .post( validateCategory, catchAsync(category.createCategory))

router.route('/:id')
    .put(isCategoryOwner, validateCategory, catchAsync(category.editCategory))
    .delete(isCategoryOwner, catchAsync(category.deleteCategory))

router.route('/:id/edit')
    .get(isCategoryOwner,catchAsync(category.renderEditForm))

module.exports = router