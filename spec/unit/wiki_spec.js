const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {

  beforeEach((done) => {
// #1
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("#create()", () => {

// #2
    it("should create a Wiki object with a valid title, body and private", (done) => {
      Wiki.create({
        title: "Test Wiki",
        body: "This is the body of the wiki. Cool, huh?",
        private: true
      })
      .then((wiki) => {
        expect(wiki.title).toBe("Test Wiki");
        expect(wiki.body).toBe("This is the body of the wiki. Cool, huh?");
        expect(wiki.private).toBe(true);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });


//TO EDIT FOR WIKI MODEL
    it("should not create a wiki with a title already taken", (done) => {

// #5
      Wiki.create({
        title: "Test Wiki",
        body: "This is the body of the wiki. Cool, huh?",
        private: true
      })
      .then((wiki) => {

        Wiki.create({
            title: "Test Wiki",
            body: "This is the body of a duplicate wiki. Not cool.",
            private: true
        })
        .then((wiki) => {

          // the code in this block will not be evaluated since the validation error
          // will skip it. Instead, we'll catch the error in the catch block below
          // and set the expectations there

          done();
        })
        .catch((err) => {
          expect(err.message).toContain("Validation error");
          done();
        });

        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

  describe("User - Wiki association", () => {

    it("should associate a wiki and a user together", (done) => {

// #1
    User.create({
        username:"frank",
        email: "user@example.com",
        password: "1234567890"
    })
    .then((user) => {
        this.user = user;
        Wiki.create({
            title: "Test Wiki",
            body: "This is the body of the wiki",
            private: true,
            userId: this.user.id
        }). then((wiki) => {// #2
                expect(wiki.userId).toBe(this.user.id);
                done();
        })
        .catch((err) => {
            console.log(err);
            done();
        });
      })
    });

  });

});