const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.post('/new', function(req, res) {
  if (!req.body.userID || !req.body.displayName) {
    return res.send({ "message": "userID and displayname are all required fields" });
  }
  let user = new User(
    {
      googleUserID: req.body.userID,
      displayName: req.body.displayName
    }
  );
  user.save(function(err, databaseUser) {
    return err ? res.send(err) : res.send(databaseUser._id);
  });
});

router.get('/:id', function(req, res) {
  User.findOne({ googleUserID: req.params.id }, function (err, user) {
    if (err) {
      console.log(err);
    } else if (!user || user.length === 0) {
      res.send({"message" : `There are no users on file with ID '${req.params.id}'`});
    } else {
      res.send(user);
    }
  })
});

module.exports = router;
