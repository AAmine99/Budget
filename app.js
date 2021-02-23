
require('dotenv').config();

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ExpressError = require('./utils/expressError')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const { isLoggedIn } = require('./middleware')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const categoriesRoutes = require('./routes/categories')
const userRoutes = require('./routes/users')
const expensesRoutes = require('./routes/expenses')
const dashRoutes = require('./routes/dashboard')
const incomeRoutes = require('./routes/income')
const helmet = require('helmet');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/prs-budget'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database connected')
});

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

const ejsMate = require('ejs-mate')
app.engine('ejs', ejsMate)

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const store = new MongoStore({
    url: dbUrl,
    secret: 'thisshoudlbeabettersecret',
    touchAfter: 24 * 60 * 60
})

store.on('error', function (e) {
    console.log('session store error', e)
})

const sessionConfig = {
    name: 'session',
    secret: 'thisshoudlbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())


app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://ka-f.fontawesome.com/" 
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://ka-f.fontawesome.com/"  
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://ka-f.fontawesome.com/"  
];
const fontSrcUrls = [
    "https://ka-f.fontawesome.com/"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://ka-f.fontawesome.com/", 
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/categories', isLoggedIn, categoriesRoutes)
app.use('/', userRoutes)
app.use('/expenses', isLoggedIn, expensesRoutes)
app.use('/dashboard', isLoggedIn, dashRoutes)
app.use('/incomes',isLoggedIn,incomeRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'something went wrong'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`listening at http://localhost:3000`)
})
