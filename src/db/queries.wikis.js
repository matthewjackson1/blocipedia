const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const Authorizer = require("../policies/wiki");

module.exports = {
  getAllWikis(callback){
        return Wiki.all({
          include: [
             {
               model: Collaborator, as: "collaborators", include: [{model: User }]
             }
           ]
       })
        .then((wikis) => {
          callback(null, wikis);
        })
        .catch((err) => {
          callback(err);
        })
      },

	addWiki(newWiki, callback){
      return Wiki.create(newWiki)
      .then((wiki) => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      })
    },

  
    getWiki(id, callback){
       return Wiki.findById(id, {
        include: [
           {
             model: Collaborator, as: "collaborators", include: [{model: User }]
           }
         ]
     })
       .then((wiki) => {
         callback(null, wiki);
       })
       .catch((err) => {
         callback(err);
       })
     },
  
    deleteWiki(req, callback){
  
   // #1
       return Wiki.findById(req.params.id, {
        include: [
           {
             model: Collaborator, as: "collaborators", include: [{model: User }]
           }
         ]
     })
       .then((wiki) => {
  
   // #2
         const authorized = new Authorizer(req.user, wiki).destroy();
  
         if(authorized) {
   // #3
           wiki.destroy()
           .then((res) => {
             callback(null, wiki);
           });
           
         } else {
  
   // #4
           req.flash("notice", "You are not authorized to do that.")
           callback(401);
         }
       })
       .catch((err) => {
         callback(err);
       });
     },
  
     updateWiki(req, updatedWiki, callback){
  
  // #1
       return Wiki.findById(req.params.id, {
        include: [
           {
             model: Collaborator, as: "collaborators", include: [{model: User }]
           }
         ]
     })
       .then((wiki) => {
  
  // #2
         if(!wiki){
           return callback("Wiki not found");
         }
  
  // #3
         const authorized = new Authorizer(req.user, wiki).update();
  
         if(authorized) {
  
  // #4
           wiki.update(updatedWiki, {
             fields: Object.keys(updatedWiki)
           })
           .then(() => {
             callback(null, wiki);
           })
           .catch((err) => {
             callback(err);
           });
         } else {
  
  // #5
           req.flash("notice", "You are not authorized to do that.");
           callback("Forbidden");
         }
       });
     },

     togglePrivacy(req, updatedWiki, callback){
  
      // #1
           return Wiki.findById(req.params.id)
           .then((wiki) => {
      
      // #2
             if(!wiki){
               return callback("Wiki not found");
             }
      
      // #3
             const authorized = new Authorizer(req.user, wiki).togglePrivacy();
      
             if(authorized) {
              //console.log("authorised");
              //console.log(wiki);
              //console.log("wiki private", wiki.private)      
               wiki.update( {
                 private: !wiki.private
               })
               .then(() => {
                 //console.log("DONE", wiki);
                 callback(null, wiki);
               })
               .catch((err) => {
                console.log(err); 
                callback(err);
                 
               });
              
             } else {
      
      // #5
               req.flash("notice", "You are not authorized to do that.");
               callback("Forbidden");
             }
           });
         },

      makePublic(id){
          return Wiki.all()
          .then((wikis) => {
            //console.log("WIKIWI", wikis);
            wikis.forEach((wiki) => {
              if(wiki.userId == id && wiki.private == true) {
                wiki.update({
                  private: false
                })
                .then(() => {

                })
                .catch((err) => {
                  console.log(err);
                });
              }
            });
          })
          .catch((err) => {
            console.log(err);
          })
        },
  

     

}