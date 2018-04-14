const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require('../../src/db/models/index').sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
    
      beforeEach((done) => {
        let userObj;
        let wikiObj;
        sequelize.sync({force: true}).then((res) => {
        
        User.create({
            username: "bob",
            email: "admin@example.com",
            password: "123456",
        })
            .then((user) => {
                //console.log("USER", user);
                userObj = user;
                //console.log("MONKEY",userObj);
                request.get({         // mock authentication
                url: "http://localhost:3000/auth/fake",
                form: {
                    username: user.username,
                    userId: user.id,
                    email: user.email
                }
                });
                done();
                //console.log("1 CHECK",userObj);      
        })
        });
        //console.log("2 CHECK",userObj);
        });
    

    describe("GET /wikis", () => {
        console.log("USEROBJ",userObj);
      //console.log("3 CHECK", userObj);
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
     //console.log("CREATE", userObj);
      const options = {
        url: `${base}create`,
        form: {
          title: "blink-182 songs",
          body: "What's your favorite blink-182 song?",
          userId: userObj.id
        }
      };

      it("should create a new wiki and redirect", (done) => {
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
        request.get(`${base}${wikiObj.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("JS Frameworks");
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

          request.post(`${base}${wikiObj.id}/destroy`, (err, res, body) => {
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
        request.get(`${base}${wikiObj.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });

    });

    describe("POST /wikis/:id/update", () => {

      it("should update the wiki with the given values", (done) => {
        request.post({
          url: `${base}${wikiObj.id}/update`,
          form: {
            title: "JavaScript Frameworks",
            body: "There are a lot of them",
            userId: userObj.id
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
            console.log(err);
            done(); 
          });
        });
      });

    });

  }); //end context for admin user

  // context of member user
  describe("member user performing CRUD actions for Wiki", () => {

    beforeEach((done) => {  // before each suite in admin context
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "member"
        }
      });
      done();
    });

    describe("GET /wikis", () => {

      it("should respond with all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          expect(body).toContain("JS Frameworks");
          done();
        });
      });

    });

    describe("GET /wikis/new", () => {

      it("should redirect to wikis view", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });

    });

    describe("POST /wikis/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "blink-182 songs",
          body: "What's your favorite blink-182 song?",
          userId: userObj.id
        }
      }

      it("should not create a new wiki", (done) => {
        request.post(options,
          (err, res, body) => {
            Wiki.findOne({where: {title: "blink-182 songs"}})
            .then((wiki) => {
              expect(wiki).toBeNull(); // no wiki should be returned
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
        // variables defined outside, like `wikiObj` are only available
        // inside `it` blocks.
        request.get(`${base}${wikiObj.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("JS Frameworks");
          done();
        });
      });
    });

    describe("POST /wikis/:id/destroy", () => {

      it("should not delete the wiki with the associated ID", (done) => {

        Wiki.all()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;

          expect(wikiCountBeforeDelete).toBe(1);

          request.post(`${base}${wikiObj.id}/destroy`, (err, res, body) => {
            Wiki.all()
            .then((wikis) => {
              // confirm that no wikis were deleted
              expect(wikis.length).toBe(wikiCountBeforeDelete);
              done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });

          });
        })

      });

    });

    describe("GET /wikis/:id/edit", () => {

      it("should not render a view with an edit wiki form", (done) => {

        request.get(`${base}${wikiObj.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Edit Wiki");
          expect(body).toContain("JS Frameworks"); // confirm redirect to wiki show
          done();
        });
      });

    });

    describe("POST /wikis/:id/update", () => {

      it("should not update the wiki with the given values", (done) => {
        const options = {
          url: `${base}${wikiObj.id}/update`,
          form: {
            title: "JavaScript Frameworks",
            body: "There are a lot of them",
            userId: userObj.id
          }
        }

        request.post(options,
        (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({
            where: { id:1 }
          })
          .then((wiki) => {
            expect(wiki.title).toBe("JS Frameworks"); // confirm title is unchanged
            done();
          })
          .catch((err) => {
              console.log(err);
              done();
          });
        });
      });

    });

  });

