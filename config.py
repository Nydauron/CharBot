import json

class Config:

    def __init__(self, config_json_path):
        with open(config_json_path, 'r') as f:
            config = json.load(f)
            self.__token = config['token']
            self.__prefix = config['prefix']
            self.__keyword = config['keyword']

    def getToken(self):
        return self.__token

    def getPrefix(self):
        return self.__prefix

    def getKeyword(self):
        return self.__keyword