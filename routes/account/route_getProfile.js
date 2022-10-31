const router = require('express').Router();
const Account = require("./_accountModel");

router.get('/', async (req, res) => {
  let userId = req.session.user._id;
  if(!userId) userId = req.query.userId;
  if (!userId) return sendError('not-connected', res);
  
  let [err, user] = await asyncPromise(Account.findById(userId));
  if(err) return sendError(err, res);
  if(!user) return sendError('undefined-user', res);

  return res.send(user);
});

module.exports = router;