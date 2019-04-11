require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');

app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// ====== Set up database connection ======
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGO_STRING, { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const Message = require('./models/message.model');
const User = require('./models/user.model');


app.get('/', function(req, res){ res.render('index'); });
app.get('/message/latest', function(req, res) {
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
app.get('/message/previous/:order', function(req, res) {
  if (req.params.order < 1) return res.send({ "message": "There are no more messages." });
  Message.find({}, function (err, data) {
    if (err) return res.send(err);
    let nextMessageOrder = req.params.order === 'undefined' ? data.length-2 : req.params.order-1;
    let previousMessage = data[nextMessageOrder].toJSON();
    previousMessage["order"] = nextMessageOrder;
    res.send(previousMessage);
  });
});
app.get('/message/random', function(req, res) {
  Message.find({}, function (err, data) {
    if (err) return res.send(err);
    let randomOrder = Math.floor(Math.random() * (data.length));
    let randomMessage = data[randomOrder];
    randomMessage["order"] = randomOrder;
    res.send(randomMessage);
  });
});
app.get('/message/all', function(req, res) {
  Message.find({}, function (err, data) {
    return err ? res.send(err) : res.send(data);
  });
});
app.post('/message/new', function(req, res) {
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
app.post('/user/new', function(req, res) {
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
app.get('/user/:id', function(req, res) {
  User.findOne({ googleUserID: req.params.id }, function (err, user) {
    if (err) { 
      console.log(err);
    } else if (!user || user.length === 0) { 
      res.send({"message" : `There are no users on file with ID '${req.params.id}'`});
    } else { 
      res.send(user); 
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT} in ${process.env.NODE_ENV}.`);
});