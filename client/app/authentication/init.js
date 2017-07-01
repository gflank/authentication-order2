const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const authenticationMiddleware = require('./middleware')
const config = require('../../config')

var bcrypt = require('bcryptjs')
var Q = require('q')

var MongoClient = require('mongodb').MongoClient
var url = config.mongoStore.url + config.appName

function localReg (username, password) {
  var deferred = Q.defer();

  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('users')

    //check if username is already assigned in our database
    collection.findOne({'username' : username}).then(function (result) {
      if (null != result) {
        console.log('Username already exists: ', result.username)
        deferred.resolve(false)
      } else {
        var hash = bcrypt.hashSync(password, 8)
        var user = {
          'username': username,
          'password': hash,
        }
        console.log("Creating user: ", username)
        collection.insert(user).then(function () {
            db.close()
            deferred.resolve(user)
        })
      }
    })
  })

  return deferred.promise
}

function localAuth (username, password) {
  var deferred = Q.defer()

  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('users')

    collection.findOne({'username': username}).then(function (result) {
      if (null == result) {
        console.log('Username not found: ', username)
        deferred.resolve(false)
      } else {
        var hash = result.password
        console.log('Found user: ', result.username)

        if (bcrypt.compareSync(password, hash)) {
          deferred.resolve(result)
        } else {
          console.log('Authentication failed')
          deferred.resolve(false)
        }
      }
      db.close()
    })
  })

  return deferred.promise
}

passport.serializeUser(function (user, done) {
  console.log('Serializing ' + user.username)
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  console.log('Deserializing ' + obj)
  done(null, obj)
})

function initPassport () {
  // Use the LocalStrategy within Passport to login/"signin" users.
  passport.use('local-signin', new LocalStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {
      localAuth(username, password)
      .then(function (user) {
        if (user) {
          console.log('Logged in as: ' + user.username)
          req.session.success = 'You are successfully logged in ' + user.username + '!'
          done(null, user)
        }
        if (!user) {
          console.log('Could not log in')
          req.session.error = 'Could not log user in. Please try again.'
          done(null, user)
        }
      })
      .fail(function (err){
        console.log(err.body)
      })
    }
  ))

  // Use the LocalStrategy within Passport to register/"signup" users.
  passport.use('local-signup', new LocalStrategy(
    {passReqToCallback : true},
    function(req, username, password, done) {
      localReg(username, password)
      .then(function (user) {
        if (user) {
          console.log('Registered: ' + user.username)
          req.session.success = 'You are successfully registered and logged in ' + user.username + '!'
          done(null, user)
        }
        if (!user) {
          console.log('Could not register')
          req.session.error = 'That username is already in use, please try a different one.'
          done(null, user)
        }
      })
      .fail(function (err){
        console.log(err.body)
      })
    }
  ))

  passport.authenticationMiddleware = authenticationMiddleware
}

module.exports = initPassport
