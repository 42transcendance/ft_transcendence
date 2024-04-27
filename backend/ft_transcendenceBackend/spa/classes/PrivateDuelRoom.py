from .DuelRoom import DuelRoom

class PrivateDuelRoom(DuelRoom):
    def __init__(self, groupName, whitelist=set()) -> None:
        super().__init__(groupName)
        self.whitelist = set ()