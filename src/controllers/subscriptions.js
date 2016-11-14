var stripe = require("stripe")("sk_test_dJrow4I6j74tdb1ExjPlaLF9");
var faker = require("faker")
var userSchema = require("../models/user.js");

exports.subscribe = function(customerInfo,callback){
  stripe.customers.create({
    source: customerInfo.token,
    plan: customerInfo.plan,
    email: customerInfo.email
  },function(err,customer){
    if(err) return callback(err)
    var user = userSchema({
      plan:customerInfo.plan,
      email:customerInfo.email,
      subscription:customer.subscriptions.data[0].id
    })

    user.save(function(err){
      if(err) return callback(err);

      return callback(null,"subscribed customer");
    })
  });
}


exports.unsubscribe = function(customerInfo,callback){
  userSchema.findOne({email:customerInfo.email},function(err,user){
    if(err) return callback(err);
    
    stripe.subscriptions.del(user.subscription,function(err,confirmation){
      if(err) return callback(err)
      user.remove(function(err){
        if(err) return callback(err)
        
        return callback(null,confirmation);
      })
    });
  })
}
