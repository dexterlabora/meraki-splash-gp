var express = require('express');
var router = express.Router();

/* GET terms page and extract Meraki paramaters. */
router.get('/', function(req, res, next) {

  var payload = {
    // dynamic data here
  }

  res.render('terms', payload);
});

module.exports = router;
