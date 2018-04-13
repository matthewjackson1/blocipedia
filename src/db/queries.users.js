// #1
const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
// #2
  createUser(newUser, callback){

// #3
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    console.log(newUser);
    const hashedPasswordConf = bcrypt.hashSync(newUser.passwordConfirmation, salt);
// #4
    if (hashedPassword === hashedPasswordConf) {
        //console.log("if statement queries.user");
        //console.log(newUser.username, newUser.email, hashedPassword);
        return User.create({
            username: newUser.username, 
            email: newUser.email,
            password: hashedPassword,
        })
        .then((user) => {

// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

            const msg = {
            to: user.email,
            from: 'test@example.com',
            subject: 'Account confirmation',
            text: 'Welcome to Blocipedia',
            html: '<strong>made by yours truly</strong>',
            };
            sgMail.send(msg);
            callback(null, user);
        })
        .catch((err) => {
            //console.log(err);
            //console.log("catch err queries.user");
            callback(err);
        })
    }
    else {
        return(err);
    }
  }


}
