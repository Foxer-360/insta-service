/**
 * Primary file for the API
 * 
 * 
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// The server should respond to all requests with a string
const server = http.createServer(function(req, res) {

  // Get the URL and parse it
  const parsedUrl = url.parse(req.url,true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the HTTP Method
  const method = req.method.toLowerCase();

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data); 
  });
  req.on('end', function(){
    buffer += decoder.end(); 

    // Choose the handler this request should go to. If one is not exist go to not found handler
    const choosenHandler = 
      typeof(router[trimmedPath]) !== 'undefined' ?
      router[trimmedPath] :
      router.notFound

    // Construct the data object to send to the handler
    const data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };
    console.log(choosenHandler, router);
    // Route the request to the handler specified in the router 
    choosenHandler(data, function(statusCode, payload) {

      // Use the status code called back by the handler, or default to 200
      statusCode = typeof  statusCode === 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or default to an empty object 
      payload = typeof payload  === 'object' ? payload: {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      	// Allow Cross Domain Request from anywhere...
	    res.setHeader("Access-Control-Allow-Origin", "*");
	    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");


      // Return the response;
      res.writeHead(statusCode);

      res.end(payloadString);

    });
  });
});
// Start the server
server.listen(config.port, function() {
  console.log(`The server is listening on port ${config.port} in ${config.envName} mode.`);
});

// Define the handlers
const handlers = {};

// Sample handler
handlers.sample = function(data, callback) {
  // Callbackk a http status code, and a payload object
  callback(406, {'name' : 'sample handler '});
}

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404);
}

handlers.instagramFeed = function({
  queryStringObject: {
    count
  }
}, callback) {
  https.get(`https://api.instagram.com` +
    `/v1/users/self/media/recent/` +
    `?access_token=${config.accessToken}` +
    (count ? `&count=${count}` : '')
  , (res) => {

    let buffer = '';

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');

    res.on('data', function(data) {
      buffer += decoder.write(data); 
    });

    res.on('end', function(data) {
      buffer += decoder.end(); 
      try {
        const parsedJson = JSON.parse(buffer);
        callback(200, JSON.parse(parsedJson));
      } catch (e) {
        callback(400, e)
        console.error(e);
      }
    });


  }).on('error', (e) => {
    callback(400, e)
    console.error(e);
  });
}

// Define a request router
const router = {
  'sample' : handlers.sample,
  'notFound' : handlers.notFound,
  'instagram-feed' : handlers.instagramFeed
}
