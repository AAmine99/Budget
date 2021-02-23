const User = require('../models/user')
const Income = require('../models/income')

module.exports.renderRegisterForm = (req, res) => {
    res.render('user/register')
}

module.exports.renderLoginForm = (req, res) => {
    res.render('user/login')
}
module.exports.createUser = async (req, res) => {
    try {
        const { income, username, password } = req.body;
        const user = new User({ income, username });
        const registeredUser = await User.register(user, password);
        const current = new Date()
        const month = current.getMonth()
        const newIncome = new Income({
            amount:income,
            author:registeredUser._id,
            month
        }) 
        await newIncome.save()
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Personal Budget');
            res.redirect('/dashboard');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
}
