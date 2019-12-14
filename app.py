import discord
import json
import threading
from config import Config
from settings import Settings

config = Config("config.json")
settings = Settings("settings.pkl")

class MyClient(discord.Client):
    async def on_ready(self):
        print('Logged on as {0}!'.format(self.user))

    async def on_message(self, message):
        print('Message from {0.author}: {0.content}'.format(message))

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

client = MyClient()
client.run(config.getToken())

def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t