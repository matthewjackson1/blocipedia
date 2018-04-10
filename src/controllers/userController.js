module.exports = {
    signup(req, res, next){
      console.log("here");
      res.render("/users/signup");
    }
}