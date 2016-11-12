var express = require('express');
var router = express.Router();
var subscriptionController = require('../controller/subscriptions.js')

/* GET home page. */
router.post('/', function(req, res, next) {
    
    subscriptionController.unsubscribe()
});

module.exports = router;
