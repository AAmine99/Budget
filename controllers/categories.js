const Category = require('../models/category')

module.exports.renderNewForm = (req, res) => {
    res.render('categories/new')
}

module.exports.index = async (req, res) => {
    let categories = await Category.find({author: req.user._id})
    res.render('categories/index', { categories })
}

module.exports.createCategory = async (req, res) => {
    const category =  new Category(req.body.category);
    category.author = req.user._id
    await category.save()
    req.flash('success', 'Successfully made a new category')
    res.redirect('categories')
}

module.exports.deleteCategory = async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id)
    if(!category){
        req.flash('error', 'Cannot find that category!')
        return res.redirect(`/categories`)
    }
    res.redirect('/categories')
}

module.exports.renderEditForm = async (req, res) => {
    const {id}= req.params
    const category = await Category.findById(id)
    if(!category){
        req.flash('error', 'Cannot find that category!')
        return res.redirect(`/categories`)
    }
    res.render('categories/edit', { category })
}
module.exports.editCategory = async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id,{...req.body.category} )
    category.lastModified= new Date()
    await category.save()
    req.flash('success', 'Successfully updated a category')
    res.redirect('/categories')
}