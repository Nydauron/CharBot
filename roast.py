class Roast:
    def __init__(self, roast_msg, user):
        self.__roast_msg = roast_msg
        self.__user = user
        self.__down_vote = 0
        self.__up_vote = 0

    # For voting, in order to prevent spamming and possible manipulation, we need to limit the amount of voting to be
    # 1 vote per 24 hrs per roast
    # Players may be able to change their vote, but this will reset the 24 hr time limit for them
    # This will be accomplished by compiling an array of the userid and the timestamp that the user voted with
    # If a user has removed his or her vote for a roast, then they are removed from that list and are eligible to revote
    # Revoting will cause the 24 cooldown period to restart.
    # After 24 hours, the users are removed from the list symbolizing that they can vote again.
    # If after 24 hours has passed, then the user will be allowed to vote again for the same roast.

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