 // #1
const express = require('express');
const router = express.Router();
const Wiki = require('../models').Wiki;
const User = require('../models').User;
const wikiQueries = require ('../queries/wiki');
const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require('../policy/wiki');
module.exports = {
 
 // #2
   add(req, res, next){
       wikiQueries.getWiki(req.params.id,(err,wiki)=>{
        const authorized = new Authorizer(req.user, wiki).editCollaborator();
        if(authorized) {
        collaboratorQueries.add(req, (err, collaborator) => {
         if(err){
           req.flash("error", err);
            }
        });
        } else {
            req.flash("notice", "You must be signed in to do that.");
            res.redirect(req.headers.referer);
        }
     });

   },
 
 // #3
   remove(req, res, next){
 
     if(req.user){
       collaboratorQueries.removeCollaborator(req, (err, collaborator) => {
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