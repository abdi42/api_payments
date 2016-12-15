var stripe = require("stripe")("sk_test_dJrow4I6j74tdb1ExjPlaLF9");
var faker = require("faker")
var subscriptionSchema = require("../models/subscription.js");

exports.subscribe = function(customerInfo,callback){
  //creating stripe customers with specified customer info
  stripe.customers.create({
    source: customerInfo.token,
    plan: customerInfo.plan,
    email: customerInfo.email
  },function(err,customer){
    if(err) return callback(err)
    //if subscription already exists send error
    subscriptionSchema.findOne({email:customerInfo.email},function(err,userSubscription){
      if(err) return callback(err)
      if(userSubscription) return callback('subscription already exists')

      //if subscription does not exist proceed to create a new one
      var userSubscription = subscriptionSchema({
        plan:customerInfo.plan,
        email:customerInfo.email,
        subscription:customer.subscriptions.data[0].id
      })


      //save to db
      userSubscription.save(function(err){
        if(err) return callback(err);

        return callback(null,"subscribed customer");
      })
    })

  });
}


exports.unsubscribe = function(customerInfo,callback){
  //find subscription in db
  subscriptionSchema.findOne({email:customerInfo.email},function(err,userSubscription){
    if(err) return callback(err);

    //remove subscription subscription
    stripe.subscriptions.del(userSubscription.subscription,function(err,confirmation){
      if(err) return callback(err)

      //remove subscription from db
      userSubscription.remove(function(err){
        if(err) return callback(err)
        return callback(null,confirmation);
      })
    });
  })
}
