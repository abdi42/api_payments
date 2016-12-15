var stripe = require("stripe")("sk_test_dJrow4I6j74tdb1ExjPlaLF9");
var ArgumentParser = require('argparse').ArgumentParser;
var faker = require("faker")
var kue = require('kue'),
    queue = kue.createQueue();


var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'jobs tester'
});

parser.addArgument(
  ['-j','--job'],
  {
    help:"type of job"
  }
)

parser.addArgument(
  ['-e','--email'],
  {
    help:"user email"
  }
)

var args = parser.parseArgs();

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
    var job = queue.create('unsubscribeCustomer', {email:args.email}).removeOnComplete(true).save();

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

if(args.job == 'subscribe' || args.job == 'sub'){
  subscribeCustomer()
}
else if(args.job == 'unsubscribe' || args.job == 'unsub'){
  if(args.email)
    unsubscribeCustomer()
}
