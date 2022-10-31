const router = require('express').Router();
/* Logout user */
router.get("/", function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) return sendError(err, res);
    res.send({ message: "disconnect" });
  });
});

module.exports = router;