import pickle

from discord import TextChannel

LATEST_VERSION_SETTINGS = '1.0'


def check_key(dict, key):
    if key in dict:
        return True
    else:
        return False


class Settings:

    def __init__(self, settings_pkl_path):
        self.__settings = {}
        self.__settings_path = settings_pkl_path
        pickle_in = open(settings_pkl_path, "rb")
        self.__settings = pickle.load(pickle_in)
        pickle_in.close()
        # self.__settings['version'] = '1.0'
        # self.__settings['guilds'] = {}
        if self.__settings['version'] == LATEST_VERSION_SETTINGS:
            print("this is latest version. Good job!")
        else:
            # Generate latest settings here WITHOUT destroying previous data
            print('hey this isn\'t the latest version settings! That\'s ok, im updating them for you!')

    def dump_settings(self):
        pickle_out = open(self.__settings_path, "wb")
        pickle.dump(self.__settings, pickle_out)
        pickle_out.close()

    # Generates new settings for any new guild that adds the bot.
    def generate_guild_default_settings(self, guild):
        self.__settings['guilds'][guild.id] = {}
        self.__settings['guilds'][guild.id]['channels'] = {}
        self.__settings['guilds'][guild.id]['settings'] = {}
        for channel in guild.channels:
            self.generate_channel_default_settings(guild.id, channel)
        print("created new settings")
        self.dump_settings()

    # Adds channel settings to the dictionary.
    def add_channel_default_settings(self, guild_id, channel):
        self.generate_channel_default_settings(guild_id, channel)
        if isinstance(channel, TextChannel):
            self.dump_settings()

    # Generates new settings for any new channel in guild.
    def generate_channel_default_settings(self, guild_id, channel):
        # Only pick TEXT channels
        if isinstance(channel, TextChannel):
            self.__settings['guilds'][guild_id]['channels'][channel.id] = {}
            self.__settings['guilds'][guild_id]['channels'][channel.id]['settings'] = {}
            self.__settings['guilds'][guild_id]['channels'][channel.id]['settings']['mention'] = False

    # Deletes channel settings for a channel.
    # Since channels have a unique ID to them, once a channel gets deleted, there is no recovering that channel ID.
    # Therefore, the settings within this channel is useless.
    def delete_channel_settings(self, guild_id, channel):
        del self.__settings['guilds'][guild_id]['channels'][channel.id]
        self.dump_settings()

    # Checks for whether the passed guild has generated settings for it.
    # Returns true if it finds settings. False otherwise.
    def does_guild_have_existing_settings(self, guild):
        does_guild_exist = check_key(self.__settings['guilds'], guild.id)
        return does_guild_exist
