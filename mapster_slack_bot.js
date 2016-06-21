if (!process.env.slack_token) {
  console.log('Error: Specify Slack token in environment');
  process.exit(1);
}

if (!process.env.gmaps_token) {
  console.log('Error: Specify Google Maps API token in environment');
  process.exit(1);
}

var Botkit = require('botkit');
var controller = Botkit.slackbot({
  debug: true
});
var bot = controller.spawn({
  token: process.env.slack_token
});
bot.startRTM(function(err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

var mwa = require(__dirname + '/maps_web_api.js');
var mapsWebApi = mwa({
  token: process.env.gmaps_token
})


controller.on(['bot_channel_join', 'bot_group_join'], function(bot, message) {
  bot.reply(message, 'Good day lads.  I\'m Mapster, i map stuff.  Just say: `@mapster map {location}`')
});

controller.hears('map (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
  var locationStr = trim(message.match[1]);
  if (!isValidAddress(locationStr)) {
    return bot.reply(message, 'Sorry, looks like an invalid address.  Usage: map [address OR latitude,longitude]');
  }

  mapsWebApi.commands.map({
    center: locationStr,
    zoom: 13,
    size: "400x500",
    maptype: "roadmap"
  }, function(err, res) {
    if (!err) {
      var reply_with_attachments = {
        'text': 'Here\'s what I found...',
        'attachments': [
          {
            'fallback': 'To be useful, I need you to invite me to a channel.',
            'title': locationStr,
            'image_url':  res,
            'color': '#00a8cd'
          }
        ]
      };
      bot.reply(message, reply_with_attachments);
    } else {
      bot.reply(message, 'Hey! That\'s not a real place!');
      console.log('Map command error: ' + err);
    }
  });
});

controller.hears('streetview (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
  var locationStr = trim(message.match[1]);
  if (!isValidAddress(locationStr)) {
    return bot.reply(message, 'Sorry, looks like an invalid address. Usage: streetview [address OR latitude,longitude]');
  }

  mapsWebApi.commands.streetview({
    location: locationStr,
    size: "400x500"
  }, function(err, res) {
    if (!err) {
      var reply_with_attachments = {
        'text': 'Here\'s what I found...',
        'attachments': [
          {
            'fallback': 'To be useful, I need you to invite me to a channel.',
            'title': locationStr,
            'image_url':  res,
            'color': '#00a8cd'
          }
        ]
      };
      bot.reply(message, reply_with_attachments);
    } else {
      bot.reply(message, 'Hey! That\'s not a real place!');
      console.log('Streetview command error: ' + err);
    }
  });
});

controller.hears('geocode (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
  var locationStr = trim(message.match[1]);
  if (!isValidAddress(locationStr)) {
    return bot.reply(message, 'Sorry, looks like an invalid address. Usage: geocode [address OR latitude,longitude]');
  }

  mapsWebApi.commands.geocode({
    address: locationStr
  }, function(err, res) {
    if (!err) {
      bot.reply(message, res.results[0].formatted_address);
    } else {
      bot.reply(message, 'Hey! That\'s not a real place!');
      console.log('Geocode command error: ' + err);
    }
  });
});

controller.hears('distance (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
  var s = trim(message.match[1]);
  var t = validateAndExtractOriginAndDestination(s);
  if (t == null) {
    return bot.reply(message, 'Sorry, looks like an invalid origin & destination. Usage: distance [origin address OR latitude,longitude] | [destination address OR latitude,longitude]');
  }
  var originsStr = t[0];
  var destinationsStr = t[1];

  mapsWebApi.commands.distance({
    origins: originsStr,
    destinations: destinationsStr,
    mode:"driving", units:"metric", size:"300x400", avoid:"tolls"
  }, function(err, res) {
    if (!err) {
      var distance = res.rows[0].elements[0].distance.text;
      var duration = res.rows[0].elements[0].duration.text;
      bot.reply(message, 'From ' + originsStr + ' to ' + destinationsStr + ', it\'s ' + distance +
      ' and it will take about ' + duration + ' to drive.');
    } else {
      bot.reply(message, 'Hey! That\'s not a real place!');
      console.log('Distance command error: ' + err);
    }
  });
});

controller.hears('height (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
  var locationStr = trim(message.match[1]);
  if (!isValidAddress(locationStr)) {
    return bot.reply(message, 'Sorry, looks like an invalid address. Usage: height [address OR latitude,longitude]');
  }

  mapsWebApi.commands.height({
    locations: locationStr
  }, function(err, res) {
    if (!err) {
      bot.reply(message, res.results[0].formatted_address);
    } else {
      bot.reply(message, 'Hey! That\'s not a real place!');
      console.log('Height command error: ' + err);
    }
  });
});

function isValidAddress(address) {
  var numbersOnly = new RegExp('/(^\d*)(\d*)(\d+$)/g')
  if (address.length <= 6 || address.length >= 100 || numbersOnly.test(address)) {
    return false;
  }
  return true;
}

function validateAndExtractOriginAndDestination(s) {
  var t = s.split('|');
  if (isValidAddress(t[0]) || isValidAddress(t[1])) {
    return t;
  }
  return null;
}

function trim(a) {
  return a.replace(/^\s+/, '').replace(/\s+$/, '');
}
