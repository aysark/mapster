var request = require('request');
var qs = require('query-string');
var fs = require('fs');

module.exports = function(config) {
  var maps_api = {
    callStaticImageApi: function(api_url, options, cb) {
      console.log('**API CALL: ' + api_url);

      if (!options.token) {
        options.token = config.token;
      }

      request(this.api_url + qs.stringify(options), function(error, resp, body) {
        if (!error && resp.statusCode == 200) {
          console.log('content-type:', res.headers['content-type']);
          console.log('content-length:', res.headers['content-length']);

          var filename = 'test-map.png';
          body.pipe(fs.createWriteStream(filename));
          // TODO: return full url path to file 
          if (cb) cb(null, filename);
        } else {
          if (cb) cb(error || 'Invalid Response');
        }
      });
    },
    callJsonApi: function(api_url, options, cb) {
      console.log('**API CALL: ' + api_url);

      if (!options.token) {
        options.token = config.tokens;
      }

      request(this.api_url + qs.stringify(options), function(error, resp, body) {
        if (!error && resp.statusCode == 200) {
          var json;
          try {
            json = JSON.parse(body);
          } catch(err) {
            if (cb) cb(err || 'Invalid JSON');
            return;
          }

          if (json.status == "OK") {
            if (cb) cb(null, json);
          } else {
            if (cb) cb(json.status, json);
          }
        }
      })
    },
    commands: {
      map: function(options, cb) {
        maps_api.callStaticImageApi('https://maps.googleapis.com/maps/api/staticmap?',
          options, cb);
      },
      streetview: function(options, cb) {
        maps_api.callStaticImageApi('https://maps.googleapis.com/maps/api/streetview?',
          options, cb);
      },
      geocode: function(options, cb) {
        maps_api.callJsonApi('https://maps.googleapis.com/maps/api/geocode/json?',
          options, cb);
      }
    }
  };
  return maps_api;
};
