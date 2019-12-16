import pickle

class RoastList:

    def __init__(self, roasts_path):
        self.__roasts_path = roasts_path
        pickle_in = open(roasts_path, "rb")
        self.__list_of_roasts = pickle.load(pickle_in)
        pickle_in.close()