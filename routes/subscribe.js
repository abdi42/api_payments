var express = require('express');
var router = express.Router();
var subscriptionController = require('../controller/subscriptions.js')

/* GET home page. */
router.post('/', function(req, res, next) {
    subscriptionController.subscribe({
      email:req.body.email,
      token:req.body.token,
      plan:req.body.plan
    },function(err){
      if(err){
        res.status(400)
        return next(err)
      }
      res.json("subscribed customer");
    })
});

module.exports = router;
