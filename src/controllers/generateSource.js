var stripe = require("stripe")("sk_test_dJrow4I6j74tdb1ExjPlaLF9");
var faker = require('faker');

module.exports = function(req,res,next){
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
}