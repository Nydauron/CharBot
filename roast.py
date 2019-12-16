class Roast:
    def __init__(self, roast_msg, user):
        self.__roast_msg = roast_msg
        self.__user = user
        self.__down_vote = 0
        self.__up_vote = 0

    def getRoast(self):
        return self.__roast_msg

    def getUser(self):
        return self.__user

    def increaseUpVote(self):
        self.__up_vote += 1

    def decreaseUpVote(self):
        self.__up_vote -= 1

    def increaseDownVote(self):
        self.__down_vote += 1

    def decreaseDownVote(self):
        self.__down_vote -= 1

    def getNetVotes(self):
        return self.__up_vote - self.__down_vote