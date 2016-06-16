var request = require('request');
var qs = require('query-string');
var fs = require('fs');

module.exports = function(config) {
  var maps_api = {
    callStaticImageApi: function(api_url, options, cb) {
      if (!options.key) {
        options.key = config.token;
      }

      console.log('**API CALL: ' + api_url + qs.stringify(options));
      request.head(api_url + qs.stringify(options), function(error, resp, body) {
        if (!error && resp.statusCode == 200) {
          console.log('content-type:', resp.headers['content-type']);
          console.log('content-length:', resp.headers['content-length']);

          if (!options.maptype) {
            var filename = 'streetview' + (new Date()).getTime() + '.png';
          } else {
            var filename = 'map' + (new Date()).getTime() + '.png';
          }
          request(api_url + qs.stringify(options)).pipe(fs.createWriteStream(filename))
            .on('close', cb(null, filename));
        } else {
          if (cb) cb(error || 'Invalid Response');
        }
      });
    },
    callJsonApi: function(api_url, options, cb) {
      if (!options.key) {
        options.key = config.token;
      }

      console.log('**API CALL: ' + api_url + qs.stringify(options));
      request(api_url + qs.stringify(options), function(error, resp, body) {
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
      },
      distance: function(options, cb) {
        maps_api.callJsonApi('https://maps.googleapis.com/maps/api/distancematrix/json?',
          options, cb);
      },
      height: function(options, cb) {
        maps_api.callJsonApi('https://maps.googleapis.com/maps/api/elevation/json?',
          options, cb);
      }
    }
  };
  return maps_api;
};
