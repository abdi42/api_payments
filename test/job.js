var stripe = require("stripe")("sk_test_dJrow4I6j74tdb1ExjPlaLF9");
var faker = require("faker")
var kue = require('kue'),
    queue = kue.createQueue();

function subscribeCustomer() {
    generateSource(function(err, customerInfo) {
        if (err) {
            console.log(err)
        }
        else {
          console.log('source generated')
          customerInfo.plan = "unlimited_plan"
          var job = queue.create('subscribeCustomer', customerInfo).removeOnComplete(true).save();
          console.log("job created");
          job.on('complete', function(result) {
              console.log(result)
          }).on('failed', function(errorMessage) {
              console.log('Job failed');
              console.log(errorMessage)
          })

        }
    })
}

function unsubscribeCustomer() {
    var job = queue.create('unsubscribeCustomer', {}).removeOnComplete(true).save();

    job.on('complete', function(result) {
        console.log(result)
    }).on('failed', function(errorMessage) {
        console.log('Job failed');
        console.log(errorMessage)
    })
}

function generateSource(done) {
    stripe.tokens.create({
        card: {
            "number": '4000000000000077',
            "exp_month": 12,
            "exp_year": 2017,
            "cvc": '123'
        }
    }, function(err, token) {

        if (err)
            return done(err)

        var customerInfo = {
            token: token.id,
            email: faker.internet.email()
        }

        return done(null, customerInfo)
    });
}


subscribeCustomer()
