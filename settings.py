import pickle

class Settings:

    def __init__(self, settings_pkl_path):
        self.__settings_path = settings_pkl_path;
        pickle_in = open(self.settings_path, "rb")
        self.__settings = pickle.load(pickle_in)


    def dump_settings(self):
        pickle_out = open(self.__settings_path, "wb")
        pickle.dump(self.__settings, pickle_out)
        pickle_out.close()