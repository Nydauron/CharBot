import pickle
import json

from roast import Roast


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

    def transfer_roasts(self):
        file = open('roasts.json', 'r')
        old_structure = json.load(file)
        new_structure = {}
        for roast_item in old_structure:
            new_roast = Roast(roast_item['submission'], 0, roast_item['updatedAt'], roast_item['up_votes'],
                              roast_item['down_votes'])
            roast_id = hash(new_roast)
            new_structure[roast_id] = new_roast
        self.__list_of_roasts = new_structure
        self.dump_roasts()

    def dump_roasts(self):
        pickle_out = open(self.__roasts_path, "wb")
        pickle.dump(self.__list_of_roasts, pickle_out)
        pickle_out.close()
