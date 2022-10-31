function login(account, req) {
  return new Promise((resolve, reject) => {
    req.session.user = account;
    account.hash = undefined;
    account.salt = undefined;
    account.__v = undefined;
    var newCookieExp = new Date();
    newCookieExp.setDate(newCookieExp.getDate() + 365);
    req.session.cookie._expires = newCookieExp;
    req.session.save((err) => {
      if (err) return reject(err);
      resolve(account);
    })
  });
};

module.exports = login
