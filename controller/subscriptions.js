var stripe = require("stripe")("sk_test_dJrow4I6j74tdb1ExjPlaLF9");
var userSchema = require("../models/users.js");

exports.subscribe = function(customerInfo,callback){
  stripe.customers.create({
    source: customerInfo.token,
    plan: customerInfo.plan,
    email: customerInfo.email
  },function(err,customer){
    if(err) return callback(err)

    var user = userSchema({
      plan:customerInfo.email,
      email:customerInfo.email,
      subscription:customer.subscriptions.data[0].id
    })

    user.save(function(err){
      if(err) return callback(err);

      return callback(null);
    })
  });
}


exports.unsubscribe = function(planId,callback){
  stripe.subscriptions.del(planId,callback);
}
