from .PublicDuelRoom import PublicDuelRoom

class PrivateDuelRoom(PublicDuelRoom):
    def __init__(self, groupName) -> None:
        super().__init__(groupName)
