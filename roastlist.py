import pickle

class RoastList:

    def __init__(self, roasts_path):
        self.__roasts_path = roasts_path
        pickle_in = open(roasts_path, "rb")
        self.__list_of_roasts = pickle.load(pickle_in)
        pickle_in.close()

        # When a roast is said, the bot will allow users to vote.
        # It keeps note of what the messageid is of that roast and associates that id with the roast in the roast list
        # Another list then keeps track of which users have voted. User voting data is NOT NECESSARILY needed since all
        # we need is if they voted or not.
        # Once a person votes, then they will have a 24 hour cooldown before they can vote for that roast again.
        # After 24 hours, the roast that was said will no longer be up for voting.
