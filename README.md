# CharBot: A Roast Bot
CharBot is a simply a roast bot. Users can command it to roast another user on the server. Credit goes to Davis Ford for his [shittalk generator](https://daviseford.com/shittalk) which provides CharBot's roasts.

## Commands
Regular users can use the following commands:

- !roast help - Displays all the commands the user can enter
- !roast <@user> - Roasts the user mentioned
- !roast random - Roasts a random user on the channel
- !roast everyone - Roasts every single user on the channel (Note: May take a while to finish if there are several people on a channel)

CharBot will roast someone automatically if you put roast before the mentioned user.

Admin users (users with kick permissions) can also use the following commands:

- !roast settings - Shows all current settings

- !roast settings reset <guild|channel> - Resets the settings for either the guild or the channel
- !roast settings randomTimeInterval <enable|disable> [minutes interval] [probability of roasting] - Sets an event to roast at a random time
  - Default: Disabled
  - If no optional arguments are provided when it is enabled the defaults will be: Interval - 30 minutes  Probability - 0.2

- !roast settings mentions <enable|disable> - Will mention the user being roasted when messaging
  - Default: Disabled

## Settings
### randomTimeInterval
Creates an event that rolls a random number between 0 and 1 every interval. If the generated number is less than the probability number, it roasts a random user.

By default, this is disabled. If it is enabled and no interval or probability number is given, then the bot will follow the default values which is 30-minute intervals and a 0.2 probability.

### mentions
The bot will mention users when it messages a roast. Since there is no way to block direct mentions, this option can eliminate annoying notifications.

By default, this setting is disabled.

## Changelog

- v1.0
  - Features
    - Call roasts on demand!
    - Randomly roast someone on your command!
    - Can be summoned in regular conversation in order to roast.
- v1.1
  - Features
    - Added options!
    - Added the randomTimeInterval option which will roast someone random every 5-10 minutes
    - Improved messaging layout.
- v1.2
  - Features
    - Added the mentions options to prevent the bot from spamming the channels.
    - Changed randomTimeInvteral option so that it is now more customizable.
    - Added changelogs. (You wouldn't be able to see this if this wasn't here!)
    - Added reset settings command to manually recreate the settings.
  - Bugfixes
    - Bot joining and leaving servers and channels now generate the correct default settings.
- v1.2.1
  - Bugfixes
    - "!roast everyone" now will roast everyone in the channel instead everyone on the server. Pointless if the person being roasted can't see it!
- v1.3
  - Bugfixes
    - Roasts are now stored locally on the bot which make roasting people faster than never! No more relying on the roast server going down and then me needing to fix it repeatively! Yay!
	- The bot now gets roasts from the server every 5 minutes instead of everytime when someone roasts. That way the server and the bot use less processing power.