const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');

router.get('/latest', function(req, res) {
  Message.findOne().sort({createdAt: -1}).exec(function (err, message) {
    if (err) {
      console.log(err);
    } else if (!message || message.length === 0) {
      res.send({"message" : 'There are no messages on file.'});
    } else {
      res.send(message);
    }
  });
});

router.get('/previous/:order', function(req, res) {
  if (req.params.order < 1) return res.send({ "message": "There are no more messages." });
  Message.find({}, function (err, data) {
    if (err) return res.send(err);
    let nextMessageOrder = req.params.order === 'undefined' ? data.length-2 : req.params.order-1;
    let previousMessage = data[nextMessageOrder].toJSON();
    previousMessage["order"] = nextMessageOrder;
    res.send(previousMessage);
  });
});

router.get('/random', function(req, res) {
  Message.find({}, function (err, data) {
    if (err) return res.send(err);
    let randomOrder = Math.floor(Math.random() * (data.length));
    let randomMessage = data[randomOrder];
    randomMessage["order"] = randomOrder;
    res.send(randomMessage);
  });
});

router.get('/all', function(req, res) {
  Message.find({}, function (err, data) {
    return err ? res.send(err) : res.send(data);
  });
});

router.post('/new', function(req, res) {
  if (!req.body.recipient || !req.body.sender || !req.body.title || !req.body.messageBody) {
    return res.send({ "message": "recipient, sender, title, and messageBody are all required fields" });
  }
  let message = new Message(
    {
      recipient: req.body.recipient,
      sender: req.body.sender,
      title: req.body.title,
      body: req.body.messageBody,
      image: req.body.image || null,
      anonymous: req.body.anonymous || false
    }
  );
  message.save(function(err, databaseMessage) {
    return err ? res.send(err) : res.send(databaseMessage._id);
  });
});

module.exports = router;
