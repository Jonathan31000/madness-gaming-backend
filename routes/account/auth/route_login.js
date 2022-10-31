const router = require('express').Router();
const passport = require("passport");
const Account = require("../_accountModel");

router.post("/", async function (req, res, next) {
  passport.authenticate("local", async function (err, user, _info) {
    if (err) return sendError("error-login", res);
    if (!user) return sendError("invalidLoginOrPassword", res);
    req.session.user = user;
    req.session.user.hash = undefined;
    req.session.user.salt = undefined;
    req.session.user.__v = undefined;

    let [errAccount, account] = await asyncPromise(Account.findOne({ _id: req.session.user._id }));
    if(errAccount) return sendError("error-find", res)
    if(!account) return sendError("undefined-find", res);

    account.lastConnection = new Date();
    let [errSavedAccount, savedAccount] = await asyncPromise(account.save());
    if (errSavedAccount) return sendError("error-save", res);

    req.session.user.lastConnection = savedAccount.lastConnection;
    let [errSavedSession, savedSession] = await asyncPromise(saveSession(req));
    if (errSavedSession) return sendError("error-save-session", res);

    res.send(savedAccount);

  })(req, res, next);
});

module.exports = router;