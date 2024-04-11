const userSchema = require("./users");
var express = require("express");
var router = express.Router();
var passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userSchema.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

// Code for logout
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Code for isLoggedIn Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

router.get("/profile", isLoggedIn, function (req, res) {
  res.render("profile", { username: req.user.username });
});

// register route
router.post("/register", function (req, res) {
  var userdata = new userSchema({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  });

  userSchema
    .register(userdata, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    })
    .catch(function (err) {
      if (err.name === "UserExistsError") {
        res.status(409).send("User already exists");
      } else {
        res.status(500).send("Internal server error");
      }
    });
});

// Code for login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

module.exports = router;
