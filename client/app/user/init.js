const passport = require('passport')

function initUser (app) {
  app.get('/signin', renderWelcome)
  app.get('/signup', renderSignUp)
  app.get('/profile', passport.authenticationMiddleware(), renderProfile)
  app.post('/local-reg', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signin'
  }))
  app.post('/login', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/signin'
  }))
  app.get('/logout', function(req, res) {
    var name = req.user.username
    console.log("Logging out " + req.user.username)
    req.logout()
    res.redirect('/')
    req.session.notice = "You have successfully been logged out " + name + "!"
  })
}

function renderWelcome (req, res) {
  res.render('user/welcome')
}

function renderSignUp (req, res) {
  res.render('user/signup')
}

function renderProfile (req, res) {
  res.render('user/profile', {
    username: req.user.username
  })
}

module.exports = initUser
