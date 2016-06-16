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
  debug:true
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


controller.on(['bot_channel_join','bot_group_join'], function(bot, message) {
  bot.reply(message, 'Good day lads.  I\'m Mapster, i map stuff.  Just say: `@mapster map {location}`')
});

controller.hears('map (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
    var locationStr = message.match[1];
    // validate, should be >= 6 alphanumeric chars
    // geocode
    mapsWebApi.commands.geocode({
      address:locationStr
    }, function(err, res) {
      if (!err) {
        console.log('Geocode command response: '+res);
        // fetch image
        mapsWebApi.commands.map({
          center:locationStr, zoom:13, size:"400x500", maptype:"roadmap"
        }, function(err, res) {
          if (!err) {
            console.log('Map command response: '+res);
            var reply_with_attachments = {
              'attachments': [
                {
                  'fallback': 'To be useful, I need you to invite me to a channel.',
                  'title': locationStr,
                  'image_url': 'http://i.imgur.com/vboStCi.png' //res
                }
              ]
            };
            bot.reply(message, reply_with_attachments);
          } else {
              console.log('Map command error: ' + err);
          }
        });
      } else {
        console.log('Geocode command error: ' + err);
      }
    });
});
