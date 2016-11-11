var stripe = require("stripe")("sk_test_dJrow4I6j74tdb1ExjPlaLF9");

exports.subscribe = function(customerInfo,callback){
  stripe.customers.create({
    source: customerInfo.token,
    plan: customerInfo.plan,
    email: customer.email
  },callback);
}
