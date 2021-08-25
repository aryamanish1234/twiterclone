const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const flash = require('connect-flash');
const User = require('./models/user');
const { isLoggedIn } = require('./middleware');
app.use(express.urlencoded({ extended: true }))

app.get('/', isLoggedIn, (req, res) => {

    res.render('layouts/main-layout')
})








mongoose.connect('mongodb://localhost:27017/twitter', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log(err));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')))


const authRoute = require('./routes/authRoutes')

app.use(session({
    secret: 'weneedabettersecret',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(flash());
app.use(authRoute);

app.listen(8080, () => {

    console.log("Server is Start at 8080");
})