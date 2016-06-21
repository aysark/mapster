# Mapster
Bring Maps to Slack!

Mapster is a helpful slack bot that knows all things map/GIS related.  He'll try to show you maps ondemand, distance, directions, elevation/height, geocoding and even streetviews!

Example usage of Mapster:

- `@mapster map New York`
- `@mapster distance New York | 40.714728,-73.998672`
- `@mapster streetview 1 yonge st, Toronto`
- `@mapster height of Mt Everest`
- `@mapster geocode 40.714728,-73.998672`

## Requirements
You will need a Google Maps API that has the following APIs enabled:

- Google Maps Distance Matrix API
- Google Maps Elevation API
- Google Maps Geocoding API
- Google Static Maps API 		
- Google Street View Image API

Get one via:
https://console.developers.google.com/apis/

And of course you'll need a slack token, you can get one via:
https://my.slack.com/services/new/bot

## Get Started
Simply run the following command:

`slack_token=SLACK_TOKEN_HERE gmaps_token=GOOGLE_MAPS_TOKEN_HERE node mapster_slack_bot.js`

Then head over to your channel to see the bot become alive.  Simply invite him or mention.
