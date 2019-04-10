const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const fs = require('fs');

app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', function(req, res){ res.render('index'); });
app.get('/message/latest', function(req, res) {
  fs.readFile('./data/messages.json', 'utf8', function (err, data){
    if (err){
        console.log(err);
    } else {
      data = JSON.parse(data); //now it an object
      let latestMessage = data.messages[data.messages.length-1] || {};
      latestMessage["order"] = data.messages.length-1;
      res.send(latestMessage); //send latest message
    }
  });
});
app.get('/message/previous/:order', function(req, res) {
  fs.readFile('./data/messages.json', 'utf8', function (err, data){
    if (err){
        console.log(err);
    } else {
      data = JSON.parse(data); //now it an object
      let nextMessage = data.messages[req.params.order-1] || {};
      nextMessage["order"] = req.params.order-1;
      res.send(nextMessage); //send latest message
    }
  });
});
app.get('/message/random', function(req, res) {
  fs.readFile('./data/messages.json', 'utf8', function (err, data){
    if (err){
        console.log(err);
    } else {
      data = JSON.parse(data); //now it an object
      let randomOrder = Math.floor(Math.random() * (data.messages.length));
      let nextMessage = data.messages[randomOrder];
      nextMessage["order"] = randomOrder;
      res.send(nextMessage); //send latest message
    }
  });
});
app.get('/message/all', function(req, res) {
  fs.readFile('./data/messages.json', 'utf8', function (err, data){
    if (err){
        console.log(err);
    } else {
      data = JSON.parse(data); //now it an object
      res.send(data); //send latest message
    }
  });
});
app.post('/message/new', function(req, res) {
  fs.readFile('./data/messages.json', 'utf8', function (err, data){
    if (err){
        console.log(err);
    } else {
      data = JSON.parse(data); //now it an object
      data.messages.push(req.body); //add some data
      data = JSON.stringify(data); //convert it back to json
      fs.writeFile('./data/messages.json', data, 'utf8', function(data) {
        res.send("Success!");
      }); // write it back 
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT} in ${process.env.NODE_ENV}.`);
});
