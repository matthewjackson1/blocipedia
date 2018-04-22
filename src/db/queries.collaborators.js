const Wiki = require('./models').Wiki;
const User = require('./models').User;
const Collaborator = require('./models').Collaborator;

module.exports = {
add(req, callback){
    if (req.user.username == req.body.collaborator){
        return callback("It's not possible to add yourself as a collaborator");
      }
      User.findAll({
        where: {
          username: req.body.collaborator
        }
      })
      .then((users)=>{
        //console.log("abc",users)
        if(!users[0]){
          return callback("User not found");
        }
       
        Collaborator.findAll({
          where: {
            userId: users[0].id,
            wikiId: req.params.id,
          }
        })
        .then((collaborators)=>{
          console.log("edf",collaborators);
          if(collaborators.length != 0){
            return callback(`${req.body.collaborator} is already a collaborator`);
          }
            let newCollab = {
                wikiId: req.params.wikiId,
                userId: users[0].id
            };
            return Collaborator.create(newCollab)
            .then((collab) => {
                callback(null, collab);
            })
            .catch((err) => {
                callback(err, null);
            })
        })
        .catch((err)=>{
            console.log(err);
            callback(err, null);
            })
        })
    .catch((err)=>{
        console.log(err);
        callback(err, null);
        })

    
  },

  remove(collab, callback){
    collab.destroy();
    callback(null, collab);
  },
}