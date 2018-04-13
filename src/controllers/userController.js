const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
    signup(req, res, next){
      console.log("here");
      res.render("users/signup");
    },

    create(req, res, next){
        console.log("Create Account");
        //console.log(req);
        let newUser = {
            username: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.password_conf
          };
     // #2
          userQueries.createUser(newUser, (err, user) => {
            if(err){
              console.log("controller err");
              req.flash("error", err);
              res.redirect("/users/signup");
            } else {
                console.log("eddy");
                // #3
                passport.authenticate("local")(req, res, () => {
                console.log("auth success!");
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
            })
           }
          });
    },

    signInForm(req, res, next){
        res.render("users/sign_in");
      },

    signIn(req, res, next){
        passport.authenticate("local")(req, res, function () {
          if(!req.user){
            req.flash("notice", "Sign in failed. Please try again.")
            res.redirect("/users/sign_in");
          } else {
            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
          }
        })
      },

    
    signOut(req, res, next){
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    }
        
}