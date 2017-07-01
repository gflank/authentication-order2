const path = require('path')

const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

const config = require('../config')
const app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))

require('./authentication').init(app)

app.use(session({
  store: new MongoStore({
    uri: config.mongoStore.url + 'session_store',
    collection: config.appName
  }),
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname),
  partialsDir: path.join(__dirname)
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname))

require('./user').init(app)

app.get('/', renderHome)

function renderHome (req, res) {
  res.render('home', {user: req.user})
}

module.exports = app
