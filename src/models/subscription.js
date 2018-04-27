var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var subscriptionSchema = new Schema({
  email: String,
  plan: String,
  subId:String
});

// we need to create a model
var Subscription = mongoose.model('Subscription', subscriptionSchema);

// make this available to our users in our Node applications
module.exports = Subscription;
