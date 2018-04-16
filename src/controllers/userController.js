const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const keySecret = process.env.SECRET_KEY;
const keyPublishable = process.env.PUBLISHABLE_KEY;
const stripe = require("stripe")(keySecret);

module.exports = {
    signup(req, res, next){
      console.log("here");
      res.render("users/signup");
    },

    create(req, res, next){
        //console.log("Create Account");
        //console.log(req);
        let newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.password_conf
          };
     // #2
          userQueries.createUser(newUser, (err, user) => {
            if(err){
              //console.log("controller err");
              req.flash("error", err);
              res.redirect("/users/signup");
            } else {
                //console.log("eddy");
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
          console.log("AUTHENTICATED");
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
    },

    upgrade(req, res, next){
      res.render("users/upgrade", {keyPublishable});
      console.log(keyPublishable);
    },

    payment(req, res, next){
      let amount = 1500;
      console.log("BULBASAUR");
      stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      })
      .then((customer) => {
        console.log("IVYSAUR");
        stripe.charges.create({
          amount,
          description: "Premium Membership",
            currency: "usd",
            customer: customer.id
        })
      })
      .then((charge) => {
        console.log("VENUSSAUR");
        userQueries.upgrade(req.user.dataValues.id);
        res.render("users/success");
        
        });
          
        },
      downgrade(req, res, next){
          console.log("CHARMANDER");
          userQueries.downgrade(req.user.dataValues.id);
          req.flash("notice", "You've successfully downgraded!");
          res.redirect("/");
          
        },

      show(req, res, next){

          // #1
           userQueries.getUser(req.params.id, (err, result) => {
           //console.log("RESULT", result); 
          // #2
              if(err || result.user === undefined){
                req.flash("notice", "No user found with that ID.");
                res.redirect("/");
              } else {
      
          // #3
                res.render("users/show", {...result, keyPublishable});
              
              }
            });
          }
}