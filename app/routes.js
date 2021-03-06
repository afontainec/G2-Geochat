// app/routes.js

const chatController = require('./controllers/chat');
const locateController = require('./controllers/locate');

module.exports = function router(app, passport) {
  // Geolocation
  app.get('/geolocate', (req, res) => {
    locateController.main(req, res, {
      lat: req.query.lat,
      lon: req.query.lon,
    });
  });

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
  app.get('/', (req, res) => {
    res.render('index.ejs'); // load the index.ejs file
  });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
  app.get('/login', (req, res) => {
        // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

    // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true, // allow flash messages
  }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
  app.get('/signup', (req, res) => {
        // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

    // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true, // allow flash messages
  }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, (req, res) => {
    chatController.main(req, res);
  });

    // =====================================
    // LOGOUT ==============================
    // =====================================
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }

    // if they aren't redirect them to the home page
  res.redirect('/');
}
