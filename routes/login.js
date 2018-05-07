var express = require('express');
var router = express.Router();
var request = require("request");
var axios = require("axios");
var configs = require("./../configs");

/* POST login data. */
router.post('/', function (req, res, next) {
  console.log("login.js / req.body: ", req.body);

  // bind client to a group policy id
  const clientMac = req.body.client_mac;
  const policyId = configs.policy;
  var baseUrl = req.protocol + '://' + req.get('host');
  axios.put(baseUrl+'/api/networks/' + configs.networkId + '/clients/' + clientMac + '/policy?timespan=84000',
    { devicePolicy: 'Group policy', groupPolicyId: policyId })
    .then(function (response) {
      console.log(response.data);
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

  /* 
 bindGroupPolicy(req.body.client_mac, configs.policy).then((res) => {
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
 }).catch((e) =>{
   console.log("Policy Failed", e);
   res.end();
 });
 */

});

/*
// Meraki API - Bind Client to Group Policy
async function bindGroupPolicy(clientMac, groupPolicyId) {
  var options = { method: 'PUT',
    url: 'https://localhost:3000/api/networks/'+configs.networkId+'/clients/'+clientMac+'/policy',
    qs: { timespan: '84000' },
    body: { devicePolicy: 'Group policy', groupPolicyId: groupPolicyId },
    json: true };
  
  console.log('requesting Meraki')
  const response = await request(options, function (error, response, body) {
    console.log('Meraki options', options);
    console.log('Meraki response', response);
    if (error) throw new Error(error);
      console.log('Meraki error',error);
    return body;
  });
  return response;
}
*/


module.exports = router;

