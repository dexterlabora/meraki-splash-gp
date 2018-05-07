// Handles Meraki API requests. Has additional logic to follow the HTTP redirects properly.

var request = require('request');
var JSONbig = require('json-bigint')({"storeAsString": true});

// Recursive function to follow Meraki API redirects
var requestMeraki = function (options, callback){  
    //console.log('requesting with options', options.url);
    //console.log(options);
    request(options, function(error, res, data) {
        //console.log('RESPONSE  [ ' + res.statusCode + ' ]');
        if (error) {
            //console.log('ERROR: ',error);
            return callback(error);
        } else {
            if ((res.statusCode == '308' || '307' || '302' || '301') && res.headers.location){
                //console.log('REDIRECT: (recursive function)')
                options.url = res.headers.location;
                return requestMeraki(options, function(err, res, data){return callback(err, res, data)});
            }else{       
                // parse the large integers properly if data exists
                try {
                    var parsedData = JSONbig.parse(data);
                    return callback(error, res, parsedData);
                } catch (e) {
                    console.log('error: no data returned ',error)         
                }
                 //console.log("FINISHED")
                return callback(error, res, data);
            }
        }
    });
}

module.exports = requestMeraki;
