const express = require('express');
const router = express.Router();
const user = require('../controllers/users')
const passport = require('passport')
const { isLoggedIn, validateRegister, validateLogin, validateIncome } = require('../middleware')


router.route('/register')
    .get(user.renderRegisterForm)
    .post(validateRegister, user.createUser)

router.route('/login')
    .get(user.renderLoginForm)
    .post(validateLogin, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login)

router.get('/logout', user.logout)


module.exports = router