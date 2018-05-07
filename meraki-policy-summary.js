
/* Meraki Group Policy Tool

Traverse the Meraki Dashboard API to display IDs for Organizations, Networks and Group Policies

npm install axios JSONbig --save

Run:
$ API_KEY=2f30UseYourOwnAPIkEyd170f node meraki-policy-summary.js

Basic Flow using async/await

- get orgs
- for each org, get network
- for each network, get policy

*/

const axios = require("axios");
var JSONbig = require('json-bigint')({"storeAsString": true});

// External Configuration File
var configs = require('./configs.js');

var apiKey = process.env.API_KEY || configs.apiKey || ''; // config env params
var baseUrl = configs.baseUrl || 'https://api.meraki.com/api/v0';

const meraki = axios.create({
    baseURL: baseUrl,
    headers: { 'X-Cisco-Meraki-API-Key': apiKey }
  });


const summary = async () => {
    console.log("Running Meraki Network Summary Tool...");
    try {
        // GET Organizations (extra helper for orgs being accidentally parsed as Ints)
        let orgs = await meraki.get('/organizations', { transformResponse: [data  => data]}).then((res) => {return res.data});
        orgs = JSONbig.parse(orgs);
        //console.log("Organizations: ", orgs);

        // GET Networks for each Organization
        for (let o of orgs){
            try {
                let nets = [] = await meraki.get('/organizations/'+o.id+'/networks').then((res) => {return res.data});
                //console.log("Networks:", nets);
                console.log("\n-- Organization -- \n Name: "+o.name +"\n ID: "+o.id);
            
                // GET Group Polices for each Network
                for (let n of nets) {
                    try {
                        let policies = [] = await meraki.get('/networks/'+n.id+'/groupPolicies').then((res) => {return res.data});
                        //console.log("Policies:", policies);
                        console.log("\n-- Network -- \n Name: "+n.name +"\n ID: "+n.id);
                        console.log("\n Group Policies");
                        if(policies.length < 1) { console.log(" None")}
                        for (let p of policies){
                            console.log("\n Name: "+p.name +"\n ID: "+p.groupPolicyId);
                        }
                    }catch (e) {
                        console.log("error in nets: ", e.response.data.errors[0]);
                    }
                }

            } catch (e) {
                console.log("error in orgs: ", e.response.data.errors[0]);
            }
            
        }   

        console.log("\n \n Done! \n");    
    } catch (e) {
       console.log("error in summary: ", e);
    }
}

summary();


