const Account = require("../_accountModel");
const login = require("./util_login");

function register(info, password, registrationOnly, req) {
  return new Promise((resolve, reject) => {
    info.createdAt = new Date();
    info.lastConnection = new Date();
    Account.register(new Account(info), password, async (err, new_account) => {
      if (err) return reject(err);
      if (!registrationOnly && typeof req != undefined) {
        let [errLoginAccount, loginAccount] = await asyncPromise(login(new_account, req));
        
        if (errLoginAccount) return reject(errLoginAccount);
        return resolve(loginAccount);
      } else {
        return resolve(new_account);
      }
    });
  })
};

module.exports = register;