const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

//set up mongoose connection
const mongoose = require('mongoose');
const mongodb = 'mongodb://swoozeki:TargetLocked1@ds113566.mlab.com:13566/blog';
mongoose.connect(mongodb);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error!'));

//view engine setup
app.set('views', './views');
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

const index = require('./routes/index');
const admin = require('./routes/admin');
app.use('/', index);
app.use('/admin', admin);

//catch 404, and pass to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
  
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3000, ()=>console.log('now listening on post 3000 at localhost:3000'));