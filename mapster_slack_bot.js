if (!process.env.slack_token) {
  console.log('Error: Specify Slack token in environment');
  process.exit(1);
}

if (!process.env.gmaps_token) {
  console.log('Error: Specify Google Maps API token in environment');
  process.exit(1);
}

var gmaps_token = process.env.gmaps_token;
var Botkit = require('botkit');
var mapsWebApi = require(__dirname + '/maps_client.js');

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


controller.on(['bot_channel_join','bot_group_join'], function(bot, message) {
  var reply_with_attachments = {
    'text': 'Good day lads.  I\'m Mapster, i map stuff.  Just say: `@mapster map {location}`',
    'attachments': [
      {
        'fallback': 'To be useful, I need you to invite me to a channel.',
        'title': 'How can I help you?',
        'image_url': 'https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key='+gmaps_token,
        'color': '#7CD197'
      }
    ]
  };
  bot.reply(message, reply_with_attachments)
});

controller.hears('map (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
    // validate
    // geocode
    // reply
});
