const express = require('express');
const router = express.Router();
const wikiQueries = require ('../db/queries.wikis.js');
const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require('../policies/wiki');
module.exports = {
 
 // #2
   add(req, res, next){
    
       
       //console.log(collaborator);
       
       const authorized = new Authorizer(req.user).editCollaborator();
        if(authorized) {
          collaboratorQueries.add(req, (err, collab) => {
            if(err){
              console.log("ERR1", err);
              req.flash("error", err);
              }
            
              console.log("RES1");
              res.redirect(req.headers.referer);
              
          });
        } else {
            req.flash("notice", "You must be signed in to do that.");
            console.log("RES2");
            res.redirect(req.headers.referer);
        }
     

   },
 
 // #3
   remove(req, res, next){
 
     if(req.user){
       collaboratorQueries.remove(req, (err, collaborator) => {
         if(err){
           req.flash("error", err);
         }
         res.redirect(req.headers.referer);
       });
     } else {
       req.flash("notice", "You must be signed in to do that.")
       res.redirect(req.headers.referer);
     }
   }
 }