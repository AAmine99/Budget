const Income = require('../models/income')


module.exports.renderNewForm = (req, res) => {
    res.render('incomes/new')
}

module.exports.index = async (req, res) => {
    const incomes = await Income.aggregate([
        { $match: { author: req.user._id } },
        { $sort: { month: 1 } }
    ])
    res.render('incomes/index', { incomes })
}

module.exports.createIncome = async (req, res) => {
    const income = await Income.find({author:req.user._id, month:req.body.income.month})
    if (income.length>0) {
        req.flash('error', 'month already asigned')
        res.redirect(`/incomes/new`)
    }
    else {
        const newIncome = new Income({ ...req.body.income })
        newIncome.author = req.user._id
        await newIncome.save()
        return res.redirect('/incomes')
        
    }
}

module.exports.rendereditFrom = async (req, res) => {
    const {id} = req.params
    const income = await Income.findById(id)
    if(!income){
        req.flash('error', 'Cannot find that income')
        return res.redirect(`/incomes`)
    }
    res.render('incomes/edit', {income})
}

module.exports.editIncome = async (req, res) => {
    const {id} = req.params
    const income = await Income.findByIdAndUpdate(id,{ ...req.body.income });
    await income.save()
    req.flash('success', 'Successfully updated a new income')
    res.redirect('/incomes')
}

module.exports.deleteIncome = async (req, res) => {
    const income = await Income.findByIdAndDelete(req.params.id)
    if(!income){
        req.flash('error', 'Cannot find that income')
        return res.redirect(`/incomes`)
    }
    res.redirect('/incomes')
}




