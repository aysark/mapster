var assert = require('chai').assert;
var mwa = require('../maps_web_api.js');
var mapsWebApi = mwa({
  token: process.env.gmaps_token
})

describe('Geocode', function() {
  it('should return OK and valid results', function(done) {
    mapsWebApi.commands.geocode({
      address:"New York"
    }, function(err, res) {
      console.log(res.results);
      assert.equal(res.status, 'OK');
      assert.isNull(err);
      assert.isArray([res.results]);
      assert.isNotNull(res.results[0].formatted_address);
      done();
    });
  });
});

describe('Map', function() {
  it('should return OK and valid results', function(done) {
    mapsWebApi.commands.map({
      center:"New York", zoom:13, size:"300x300", maptype:"roadmap"
    }, function(err, res) {
      console.log(res);
      assert.isNotNull(res);
      assert.isNull(err);
      done();
    });
  });
});

describe('Streetview', function() {
  it('should return OK and valid results', function(done) {
    mapsWebApi.commands.streetview({
      location:"New York", size:"300x400"
    }, function(err, res) {
      console.log(res);
      assert.isNotNull(res);
      assert.isNull(err);
      done();
    });
  });
});

describe('Distance', function() {
  it('should return OK and valid results', function(done) {
    mapsWebApi.commands.distance({
      origins:"New York", destinations:"Los Angeles", mode:"driving",
      units:"metric", size:"300x400", avoid:"tolls"
    }, function(err, res) {
      console.log(res.rows[0].elements[0]);
      assert.isNotNull(res.rows[0].elements[0].distance.text);
      assert.isNotNull(res.rows[0].elements[0].duration.text);
      assert.isNull(err);
      done();
    });
  });
});

describe('Height', function() {
  it.only('should return OK and valid results', function(done) {
    mapsWebApi.commands.height({
      locations:"New York"
    }, function(err, res) {
      console.log(res);
      assert.isNotNull(res);
      assert.isNull(err);
      done();
    });
  });
});
