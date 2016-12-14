var stripe = require("stripe")("sk_test_dJrow4I6j74tdb1ExjPlaLF9");
var faker = require('faker');
var mongoose = require('mongoose');
var subscriptionsController = require("./controllers/subscriptions.js")
var kue = require('kue')
 , queue = kue.createQueue();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/payments');

queue.process('subscribeCustomer',25, function(job, done){
  if(!job.data.email)
    return done(createNewError("user email not specified"))
  else if(!job.data.plan)
    return done(createNewError("subscription plan not specified"))
  else if(!job.data.token)
    return done(createNewError("user source not specified"))
  else
    subscriptionsController.subscribe(job.data,done)
});

queue.process('unsubscribeCustomer',25, function(job, done){
  if(!job.data.email)
    return done(createNewError("user email not specified"))
  else
    subscriptionsController.unsubscribe(job.data,done)
});

function createNewError(err){
    var error = new Error(err)
    return error
}
