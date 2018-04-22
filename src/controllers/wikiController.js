const wikiQueries = require("../db/queries.wikis.js");
const passport = require("passport");
const Authorizer = require("../policies/wiki");
const markdown = require( "markdown" ).markdown;

module.exports = {
    wiki(req, res, next){

      console.log("wiki here");
      wikiQueries.getAllWikis((err, wikis) => {
        if(err){
          res.redirect(500, "static/index");
        } else {
          res.render("wikis/wiki", {wikis});
        }
      })
      
    },

    new(req, res, next){
        // #2
            const authorized = new Authorizer(req.user).new();
       
            if(authorized) {
              res.render("wikis/new");
            } else {
              req.flash("notice", "You are not authorized to do that.");
              res.redirect("/wikis");
            }
          },

    newPrivate(req, res, next){

      const authorized = new Authorizer(req.user).newPrivate();
       
      if(authorized) {
        res.render("wikis/newPrivate");
      } else {
        req.flash("notice", "You are not authorized to do that.");
        res.redirect("/wikis");
      }

    },
           
    create(req, res, next){
            console.log("OWL", req.user);
        // #1
            const authorized = new Authorizer(req.user).create();
       
        // #2
            if(authorized) {
            //console.log("authorized");
            console.log("COW",req.user);
              let newWiki = {
                title: req.body.title,
                body: req.body.body,
                userId: req.user.id
              };
              wikiQueries.addWiki(newWiki, (err, wiki) => {
                if(err){
                  console.log(err);
                  res.redirect(500, "new");
                } else {
                  res.redirect(303, `/wikis/${wiki.id}`);
                }
              });
            } else {
       
        // #3
              req.flash("notice", "You are not authorized to do that.");
              res.redirect("/wikis");
            }
          },

    createPrivate(req, res, next){
  
      // #1
          const authorized = new Authorizer(req.user).createPrivate();
      
      // #2
          if(authorized) {
          //console.log("authorized");
            let newWiki = {
              title: req.body.title,
              body: req.body.body,
              userId: req.user.id,
              private: true
            };
            wikiQueries.addWiki(newWiki, (err, wiki) => {
              if(err){
                console.log(err);
                res.redirect(500, "new_private");
              } else {
                res.redirect(303, `/wikis/${wiki.id}`);
              }
            });
          } else {
      
      // #3
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/wikis");
          }
        },
       
       
    show(req, res, next){
       
            wikiQueries.getWiki(req.params.id, (err, wiki) => {
              
              if(err || wiki == null){
                console.log(err);
                res.redirect(404, "/");
              } else {
                wiki.body = markdown.toHTML(wiki.body);
                res.render("wikis/show", {wiki});
              }
            });
          },
       
    destroy(req, res, next){
       
        // #1
            wikiQueries.deleteWiki(req, (err, wiki) => {
              if(err){
                res.redirect(err, `/wikis/${req.params.id}`)
              } else {
                res.redirect(303, "/wikis")
              }
            });
          },
       
    edit(req, res, next){
       
        // #1
            wikiQueries.getWiki(req.params.id, (err, result) => {
              if(err || result == null){
                res.redirect(404, "/");
              } else {
       
        // #2
                const authorized = new Authorizer(req.user, wiki).edit();
       
        // #3
                if(authorized){
                  res.render("wikis/edit", {...result});
                } else {
                  req.flash("You are not authorized to do that.")
                  res.redirect(`/wikis/${req.params.id}`)
                }
              }
            });
          },
       
    update(req, res, next){
       
        // #1
            wikiQueries.updateWiki(req, req.body, (err, wiki) => {
              if(err || wiki == null){
                res.redirect(401, `/wikis/${req.params.id}/edit`);
              } else {
                res.redirect(`/wikis/${req.params.id}`);
              }
            });
          },

    togglePrivacy(req, res, next){
          wikiQueries.togglePrivacy(req, req.body, (err, wiki) => {
            if(err || wiki == null){
              res.redirect(401, `/wikis/${req.params.id}/edit`);
            } else {
              res.redirect(`/wikis/${req.params.id}`);
            }
          });
        },


        
}