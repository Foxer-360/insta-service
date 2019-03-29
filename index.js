var http = require('http');
var express = require('express');
var api = require('instagram-node').instagram();
var app = express();
var feed = [];

require('dotenv').config();
 
var redirect_uri = `${process.env.INSTAGRAM_URL}/handleauth`;

exports.authorize_user = function(req, res) {
  api.use({
    client_id: process.env.INSTAGRAM_CLIENT_ID,
    client_secret: process.env.INSTAGRAM_SECRET
  });
  
  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err);
      return res.send('Cannot get Access token.');
    }

    api.use({
      access_token: result.access_token 
    });

    api.user_media_recent(result.user.id, { count: 100 }, function (err, medias, pagination, remaining, limit) {
      if (err) {
        return res.send('Cannot get Access token.');
      }

      feed = medias;
    });

    return res.send('Feed is updated!');
  });
};

exports.feed = function(req, res) {
  const limit = req.query.count || process.env.INSTAGRAM_DEFAULT_LIMIT;
  if(!Array.isArray(feed)) return [];
  res.send(
    {
      pagination: {},
      data: feed.splice(0, limit),
      meta: {
        code: 200
      }
    }
  );
};
 
// This is where you would initially send users to authorize
app.get('/', exports.authorize_user);

// This is your redirect URI
app.get('/handleauth', exports.handleauth);

app.get('/instagram-feed', exports.feed);
 
http.createServer(app).listen(process.env.INSTAGRAM_PORT, function(){
  console.log("Express server listening on port " + process.env.INSTAGRAM_PORT);
});