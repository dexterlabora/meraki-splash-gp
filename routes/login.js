var express = require('express');
var router = express.Router();
var request = require("request");
var axios = require("axios");
var configs = require("./../configs");

/* POST login data. */
router.post('/', function (req, res, next) {
  //console.log("login.js / req.body: ", req.body);

  // API parameters
  const clientMac = req.body.client_mac;
  const policyId = configs.policy;
  const baseUrl = req.protocol + '://' + req.get('host');
  const apiEndpoint = '/api/networks/' + configs.networkId + '/clients/' + clientMac + '/policy?timespan=84000';

  // Bind client to a group policy id
  axios.put(baseUrl+apiEndpoint,
    { devicePolicy: 'Group policy', groupPolicyId: policyId })
    .then(function (response) {
      console.log("Policy Applied: ", response.data);
      // Process Meraki Login
      res.writeHead(302, {
        'Location': req.body.base_grant_url + "?continue_url=" + req.body.user_continue_url
      });
      res.end();
      //res.render('index', payload);
    })
    .catch(function (error) {
      console.log("Policy Failed", error);
      res.end();
    });

});

module.exports = router;

