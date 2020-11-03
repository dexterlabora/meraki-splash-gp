var express = require("express");
var router = express.Router();

/* GET splash page and extract Meraki paramaters. */
router.get("/", function (req, res, next) {
  //console.log("index.js / req.body: ",req.body);

  var payload = {
    host: req.headers.host,
    base_grant_url: req.query.base_grant_url,
    user_continue_url: req.query.user_continue_url,
    node_mac: req.query.node_mac,
    client_ip: req.query.client_ip,
    client_mac: req.query.client_mac,
    splashclick_time: new Date().toString(),
  };

  res.render("index", payload);
});

module.exports = router;
