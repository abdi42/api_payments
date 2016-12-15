var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var subscriptionSchema = new Schema({
  email: String,
  plan: String,
  subscription:String,
});

// we need to create a model
var User = mongoose.model('Subscription', subscriptionSchema);

// make this available to our users in our Node applications
module.exports = User;
