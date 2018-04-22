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
            //console.log("abc",users);
            //console.log("WIKIID", req.params.wikiId);
            //console.log("USERID", users[0].id);
            if(!users[0]){
            return callback("That username was not found. Please check the spelling and try again.");
            }
        
            Collaborator.findAll({
            where: {
                userId: users[0].id,
                wikiId: req.params.wikiId,
            }
            })
            .then((collaborators)=>{
            console.log("edf",collaborators);
            if(collaborators.length != 0){
                return callback(`${req.body.collaborator} is already collaborating on this Wiki`);
            }
                let newCollab = {
                    wikiId: req.params.wikiId,
                    userId: users[0].id
                };
                console.log("newCollab",newCollab);
                return Collaborator.create(newCollab)
                .then((collab) => {
                    callback(null, collab);
                })
                .catch((err) => {
                    console.log(err);
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