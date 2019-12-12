import json

class Config:

    def __init__(self, config_json_path):
        with open(config_json_path, 'r') as f:
            config = json.load(f)
            self.token = config["token"]

    def getToken(self):
        return self.token