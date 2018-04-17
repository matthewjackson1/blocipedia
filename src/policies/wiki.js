const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

 // #2
  newPrivate() {
    return this._isAdmin() || this._isPremium();
  }

  createPrivate() {
    return this.newPrivate();
  }

  togglePrivacy() {
    return this.newPrivate();
  }

 
}