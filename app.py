import discord
import json
import threading

from discord.utils import get

from config import Config
from roastlist import RoastList
from settings import Settings
from notauserexception import NotAUserException
from nouserfoundexception import NoUserFoundException

config = Config("config.json")
settings = Settings("settings.pkl")
roast_list = RoastList('roasts.pkl')
# roast_list.transfer_roasts() # Was used to transfer old roast structure to the new structure.

class MyClient(discord.Client):
    async def on_ready(self):
        print('Logged on as {0}!'.format(self.user))

    async def on_message(self, message):
        if message.author == self.user or message.author.bot == True:
            return
        print('Message from {0.author}: {0.content}'.format(message))
        args = message.content.split()
        if len(args) > 0:
            print('You sent something!')
            if args[0] == config.getPrefix():
                # Commands go here
                print('I am being commanded!')
            else:
                roast_index = args.index(config.getKeyword())
                if roast_index >= 0 and roast_index + 1 < len(args):
                    try:
                        getUserFromMention(args[roast_index + 1])
                    except NotAUserException:
                        print('Mention is not even a user')
                    except NoUserFoundException:
                        print('Can\'t find user')

        else:
            # Discord by default doesn't allow users to send nothing. However, as a precaution, this case will cover
            # it does.
            print('You sent nothing!')

    async def on_guild_join(self, guild):
        # This needs to be able to generate the default settings based off the guild and channel ids
        # This also needs to identify to NOT generate new settings if there already exists settings for that server
        # Settings should revolve around VERSIONS so that if in future I update any part of the data structure, the bot
        #     boot up will rebuild the settings WHILE maintaining integrity of the data previously stored
        print('I joined a guild!')
        if not settings.does_guild_have_existing_settings(guild):
            settings.generate_guild_default_settings(guild)

    async def on_guild_remove(self, guild):
        # I am deciding to KEEP the settings stored instead of deleting them in the event the bot gets removed and then
        #     is readded
        print('I was removed from a guild')

    async def on_guild_channel_create(self, channel):
        print(channel)
        # if not settings.does_guild_have_existing_settings(channel.guild):
        #     settings.generate_guild_default_settings(channel.guild)
        settings.generate_channel_default_settings(channel.guild.id, channel)

    async def on_guild_channel_delete(self, channel):
        settings.delete_channel_settings(channel.guild.id, channel)
        print('Bot was removed from channel ' + channel.name + '.')

    async def on_raw_reaction_add(self, payload):
        channel_id = payload.channel_id
        channel = MyClient.get_channel(self, channel_id)
        msg = await channel.fetch_message(payload.message_id)
        if msg.author == self.user:
            print('Thanks for reacting to me!')
            print(msg.content)

def getUserFromMention(user_mention):
    beginning_index = user_mention.find('!') + 1
    if beginning_index == 0:
        beginning_index = user_mention.find('@') + 1
    end_index = user_mention.find('>')
    if beginning_index < 1 or end_index < 0 or end_index != len(user_mention) - 1:
        raise NotAUserException
    user_id = user_mention[beginning_index:end_index]
    members = client.get_all_members()
    user = get(members, id=user_id)
    if user:
    # found
        return user
    else:
        raise NoUserFoundException


# Not found



client = MyClient()
client.run(config.getToken())


def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()

    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t
