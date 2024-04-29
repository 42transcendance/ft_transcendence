from .PublicDuelRoom import PublicDuelRoom

class PrivateDuelRoom(PublicDuelRoom):
    def __init__(self, groupName, whitelisted_player_id) -> None:
        super().__init__(groupName)
        self.whitelisted_player_id = whitelisted_player_id