var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stripe = require("stripe")("sk_test_dJrow4I6j74tdb1ExjPlaLF9");
var subscribe = require('./routes/subscribe');
var faker = require('faker');
var mongoose = require('mongoose');

var app = express();
mongoose.connect('mongodb://localhost/payments');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  console.log("STRIPE")
  stripe.tokens.create({
    card: {
      "number": '4000000000000077',
      "exp_month": 12,
      "exp_year": 2017,
      "cvc": '123'
    }
  }, function(err, token) {
    if(err){
      next(err)
    }

    req.body.token = token.id;
    req.body.email = faker.internet.email();

    next(null);
  });
})

app.use('/subscribe', subscribe);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
