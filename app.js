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
mongoose.connect(process.env.MONGO_STRING, { useUnifiedTopology: true, useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// ====== Set API up routes ======
const userRoutes = require('./routes/user.routes');
const messageRoutes = require('./routes/message.routes');
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/message', messageRoutes);

// ====== Serve index page ======
app.get('/', function(req, res){ res.render('index'); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT} in ${process.env.NODE_ENV}.`);
});
