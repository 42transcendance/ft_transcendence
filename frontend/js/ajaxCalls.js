document.addEventListener('DOMContentLoaded', function() {
    fetchUserProfile();
    fetchGameHistory();
    fetchAchievements();

    function fetchUserProfile() {
        // to be replaced with actual API endpoint
        fetch('/api/user/profile') 
            .then(response => response.json())
            .then(data => {
                updateProfilePage(data);
            })
            .catch(error => console.error('Error:', error));
    }

    function fetchGameHistory() {
        // to be replaced with actual API endpoint
        fetch('/api/user/game-history') 
            .then(response => response.json())
            .then(data => {
                addGameHistoryItems(data.gameHistory);
            })
            .catch(error => console.error('Error:', error));
    }

    function fetchAchievements() {
        // to be replaced with actual API endpoint
        fetch('/api/user/achievements') 
            .then(response => response.json())
            .then(data => {
                addAchievementItems(data.achievements);
            })
            .catch(error => console.error('Error:', error));
    }

    function updateProfilePage(data) {
        // Replacing keys with actual ones from our API response
        document.getElementById('username').textContent = data.username;
        document.getElementById('userPfp').src = data.profilePictureUrl || 'assets/pfp.png';
        document.getElementById('joinedDate').textContent = `Joined: ${data.joinedDate}`;
        document.getElementById('ranking').textContent = `Ranking: ${data.rank}`;
        document.getElementById('matchesPlayed').textContent = `Matches Played: ${data.gamesPlayed}`;
    }

    function addGameHistoryItems(gameHistory) {
        const gameHistoryContainer = document.querySelector('.game-history'); // Ensure you have this container in your HTML

        gameHistory.forEach(game => {
            addGameHistoryItem(game, gameHistoryContainer);
        });
    }

    function addGameHistoryItem(game, container) {
        // Creating a game history item element
        const gameItem = document.createElement('div');
        gameItem.classList.add('game-item');
        gameItem.classList.add(game.outcome); // 'win' or 'lose'

        // Adding game details to the game history item
        gameItem.innerHTML = `
            <div class="game-details">
                <div class="game-opponent">Versus: ${game.opponent}</div>
                <div class="game-result">${game.date}</div>
            </div>
            <div class="game-info">
                <div class="game-date">${game.outcome}</div>
                <div class="game-score">Score: ${game.score}</div>
            </div>
        `;
        container.appendChild(gameItem);
    }

    function addAchievementItems(achievements) {
        const achievementsContainer = document.querySelector('.user-achievements'); 

        achievements.forEach(achievement => {
            const achievementItem = document.createElement('div');
            achievementItem.classList.add('achievement-item');

            achievementItem.innerHTML = `
                <img src="${achievement.iconUrl}" alt="Achievement" class="achievement-logo">
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            `;
            achievementsContainer.appendChild(achievementItem);
        });
    }
});


// friends list 3rd container, profile page

document.addEventListener('DOMContentLoaded', function() {
    fetchFriendsList();

    function fetchFriendsList() {
        // Replace with our the actual API endpoint
        fetch('/api/user/friends-list') 
            .then(response => response.json())
            .then(data => {
                addFriendsListItems(data.friendsList);
            })
            .catch(error => console.error('Error:', error));
    }

    function addFriendsListItems(friendsList) {
        const friendsListContainer = document.querySelector('.friends-list-content');

        friendsList.forEach(friend => {
            const friendItem = document.createElement('div');
            friendItem.classList.add('friend-item');

            friendItem.innerHTML = `
                <img src="${friend.profilePictureUrl || 'assets/pfp.png'}" alt="${friend.nickname}'s Name" class="friend-image">
                <div class="friend-info">
                    <div class="friend-nickname">${friend.nickname}</div>
                </div>
                <i class="bi bi-person icon-friend-profile"></i>
            `;

            friendsListContainer.appendChild(friendItem);
        });
    }
});


//Settings tab pfp load

document.addEventListener('DOMContentLoaded', function() {
    fetchUserSettings();

    function fetchUserSettings() {
        fetch('/api/user/settings')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if(data.pfpUrl) {
                    updateProfilePicture(data.pfpUrl);
                }
            })
            .catch(error => {
                console.error('Error fetching user settings:', error);
            });
    }

    function updateProfilePicture(pfpUrl) {
        document.querySelector('.pfp-container .user-pfp').src = pfpUrl;
    }
});

//achievements


document.addEventListener('DOMContentLoaded', function() {
    fetchAchievements();

    function fetchAchievements() {
        // Fetch achievements from the server
        fetch('/api/user/achievements')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Assuming the achievements are returned as an array of objects
                if(Array.isArray(data.achievements)) {
                    updateAchievements(data.achievements);
                }
            })
            .catch(error => {
                console.error('Error fetching achievements:', error);
            });
    }

    function updateAchievements(achievements) {
        const achievementsContent = document.querySelector('.achievements-content');
        // Clearing existin achievements to avoid duplicates
        achievementsContent.innerHTML = '';

        achievements.forEach(achievement => {
            const achievementItem = document.createElement('div');
            achievementItem.classList.add('achievement-item');

            const logoImg = document.createElement('img');
            logoImg.src = achievement.logoUrl;
            logoImg.alt = "Logo";
            logoImg.classList.add('achievement-logo');

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('achievement-info');

            const nameDiv = document.createElement('div');
            nameDiv.classList.add('achievement-name');
            nameDiv.textContent = achievement.name; // Assuming each achievement object has a name

            const descriptionDiv = document.createElement('div');
            descriptionDiv.classList.add('achievement-description');
            descriptionDiv.textContent = achievement.description; // Assuming each achievement object has a description

            infoDiv.appendChild(nameDiv);
            infoDiv.appendChild(descriptionDiv);

            achievementItem.appendChild(logoImg);
            achievementItem.appendChild(infoDiv);

            achievementsContent.appendChild(achievementItem);
        });
    }
});


//first tab - friends section
document.addEventListener('DOMContentLoaded', function() {
    fetchAllData();

    function fetchAllData() {
        fetchFriends();
        fetchOutgoingRequests();
        fetchIncomingRequests();
        fetchBlockedContacts();
    }

    function fetchFriends() {
        fetch('/api/friends')
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    displayFriends('friendsTabContent', data);
                } else {
                    displayEmpty('friendsTabContent');
                }
            })
            .catch(error => console.error('Error fetching friends:', error));
    }

    function fetchOutgoingRequests() {
        fetch('/api/friend-requests/outgoing')
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    displayRequests('outgoingRequestsTabContent', data);
                } else {
                    displayEmpty('outgoingRequestsTabContent');
                }
            })
            .catch(error => console.error('Error fetching outgoing requests:', error));
    }

    function fetchIncomingRequests() {
        fetch('/api/friend-requests/incoming')
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    displayRequests('incomingRequestsTabContent', data);
                } else {
                    displayEmpty('incomingRequestsTabContent');
                }
            })
            .catch(error => console.error('Error fetching incoming requests:', error));
    }

    function fetchBlockedContacts() {
        fetch('/api/friends/blocked')
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    displayBlocked('blockedTabContent', data);
                } else {
                    displayEmpty('blockedTabContent');
                }
            })
            .catch(error => console.error('Error fetching blocked contacts:', error));
    }

    function displayFriends(containerId, friends) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        friends.forEach(friend => {
            container.innerHTML += `
                <div class="friend-item">
                    <img src="${friend.image}" alt="${friend.name}" class="friend-image">
                    <div class="friend-info">
                        <div>${friend.name}</div>
                    </div>
                    <i class="bi bi-chat icon-chat"></i>
                    <i class="bi bi-controller icon-controller"></i>
                    <i class="bi bi-x-circle icon-block"></i>
                </div>
            `;
        });
    }

    function displayRequests(containerId, requests) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        requests.forEach(request => {
            container.innerHTML += `
                <div class="friend-item">
                    <img src="${request.image}" alt="${request.name}" class="friend-image">
                    <div class="friend-info">
                        <div>${request.name}</div>
                    </div>
                </div>
            `;
        });
    }

    function displayBlocked(containerId, blocked) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; 
        blocked.forEach(block => {
            container.innerHTML += `
                <div class="friend-item">
                    <img src="${block.image}" alt="${block.name}" class="friend-image">
                    <div class="friend-info">
                        <div>${block.name}</div>
                    </div>
                    <i class="bi bi-x-circle icon-block"></i>
                </div>
            `;
        });
    }

    function displayEmpty(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `<div style='color: red;'>Empty</div>`;
    }
});

//first tab - channels

document.addEventListener('DOMContentLoaded', function() {
    fetchChannels();

    function fetchChannels() {
        fetch('/api/channels') // Adjust
            .then(response => response.json())
            .then(data => displayChannels(data))
            .catch(error => console.error('Error fetching channels:', error));
    }

    function displayChannels(channels) {
        const container = document.getElementById('channelsTabContent');
        container.innerHTML = '';
        channels.forEach(channel => {
            const channelElement = `
                <div class="channel-item">
                    <img src="${channel.image || 'assets/pfp.png'}" alt="${channel.name}" class="friend-image">
                    <div class="friend-info">
                        <div>${channel.name}</div>
                    </div>
                    <i class="bi bi-chat channels-icon"></i>
                    <i class="bi bi-gear channels-icon"></i>
                </div>
            `;
            container.innerHTML += channelElement;
        });

        if (channels.length === 0) {
            container.innerHTML = '<div style="color: red;">No channels found</div>';
        }
    }
});
