const router = require('express').Router();
const register = require("./util_register");

router.post("/", async (req, res, _next) => {
  let registrationOnly = false
  if (req.body.registrationOnly) registrationOnly = req.body.registrationOnly;
  let password = req.body.password;
  let [errRegisterAccount, registerAccount] = await asyncPromise(register(req.body, password, registrationOnly, req));
  if (errRegisterAccount) {
    if (errRegisterAccount.name == "UserExistsError") sendError("user-exist", res);
    else sendError("errorOccured", res);
  }
  res.send(registerAccount);
});

module.exports = router;
