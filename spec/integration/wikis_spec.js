const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require('../../src/db/models/index').sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const passport = require("passport");
//const Authorizer = require("../src/policies/wiki");

describe("routes : wikis", () => {
    
      beforeEach((done) => {
        this.user;
        this.wiki;
        sequelize.sync({force: true}).then((res) => {
        
        User.create({
            username: "bob",
            email: "admin@example.com",
            password: "123456",
        })
            .then((user) => {
                //console.log("USER", user);
                this.user = user;
                
                //console.log("MONKEY",this.user);
                request.get({         // mock authentication
                url: "http://localhost:3000/auth/fake",
                form: {
                    username: user.username,
                    userId: user.id,
                    email: user.email,
                    role: 0
                }
                });
                Wiki.create({
                  title: "JavaScript" ,
                  body: "JS frameworks and fundamentals",
                  userId: user.id
                })
                .then((wiki) => {
                  this.wiki = wiki;
                  done();
                })
                .catch((err) => {
                  console.log(err);
                  done();
                })

                
                //console.log("1 CHECK",this.user);      
        })
        .catch((err) => {
          console.log(err);
          done();
        })
        });
        //console.log("2 CHECK",this.user);
        });
    

    describe("GET /wikis", () => {
<<<<<<< HEAD
=======
        
>>>>>>> blocipedia-9
      it("should respond with all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          done();
        });
      });

    });

    describe("GET /wikis/new", () => {
      it("should render a view with a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });

    });

    describe("POST /wikis/create", () => {
<<<<<<< HEAD
     //console.log("CREATE", this.user);
      

      it("should create a new wiki and redirect", (done) => {
        console.log("CONSOLE",this.user);
          const options = {
            url: `${base}create`,
            form: {
              title: "blink-182 songs",
              body: "What's your favorite blink-182 song?",
              userId: this.user.id
            }
          };
=======

      it("should create a new wiki and redirect", (done) => {
        //console.log("CONSOLE",this.user);
        const options = {
          url: `${base}create`,
          form: {
            title: "blink-182 songs",
            body: "What's your favorite blink-182 song?",
            userId: this.user.id,
            email: this.user.email
          }
       };
>>>>>>> blocipedia-9
        request.post(options,
          (err, res, body) => {
            Wiki.findOne({where: {title: "blink-182 songs"}})
            .then((wiki) => {
              expect(wiki.title).toBe("blink-182 songs");
              expect(wiki.body).toBe("What's your favorite blink-182 song?");
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          }
        );
      });
    });

    describe("GET /wikis/:id", () => {
      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("JS frameworks");
          console.log("BETTY");
          done();
        });
      });

    });

    describe("POST /wikis/:id/destroy", () => {


      it("should delete the wiki with the associated ID", (done) => {
        Wiki.all()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;

          expect(wikiCountBeforeDelete).toBe(1);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.all()
            .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })

          });
        })

      });

    });

    describe("GET /wikis/:id/edit", () => {
      
      it("should render a view with an edit wiki form", (done) => {
        //console.log("ELEPHANT", this.wiki);
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          console.log("RESY",  body);
          expect(body).toContain("Edit Wiki");
          console.log("DONE DONE");
          expect(body).toContain("JS frameworks");
          done();
        });
      
        
      
        });
      });

    

    describe("POST /wikis/:id/update", () => {
      
      it("should update the wiki with the given values", (done) => {
        request.post({
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "JavaScript Frameworks",
            body: "There are a lot of them",
            userId: this.user.id
          }
        }, (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({
            where: {id:1}
          })
          .then((wiki) => {
            expect(wiki.title).toBe("JavaScript Frameworks");
            done();
          })
          .catch((err) => {
            console.log("PANDA", err);
            done(); 
          });
        });
      });

    });

  }); //end context for admin user

  // context of member user
  

  

