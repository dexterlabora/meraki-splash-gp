var express = require('express');
var router = express.Router();
var request = require("request");
var configs = require("./../configs");

/* POST login data. */
router.post('/', function(req, res, next) {
    console.log("login.js / req.body: ",req.body);

    // bind client to a group policy id
    bindGroupPolicy(req.body.client_mac, configs.policy);

    // Store Data
    // ToDo write to a database 
    var session = req.body;
    session.policy = configs.policy;
    console.log("Client Session",session);


    // Process Meraki Login
    res.writeHead(302, {
      'Location': req.body.base_grant_url + "?continue_url="+req.body.user_continue_url}
    );
    res.end();
      //res.render('index', payload);
});

// Meraki API - Bind Client to Group Policy
function bindGroupPolicy(clientMac, groupPolicyId) {
  var options = { method: 'PUT',
    url: 'https://'+configs.shard+'.meraki.com/api/v0/networks/'+configs.networkId+'/clients/'+clientMac+'/policy',
    qs: { timespan: '84000' },
    headers: { 'content-type': 'application/json',
       'x-cisco-meraki-api-key': configs.apiKey
    },
    body: { 
      type: 'Group policy', 
      groupPolicyId: groupPolicyId 
    },
    json: true 
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    
    console.log("Meraki Group Policy Applied", body);
  });
}
  

module.exports = router;

