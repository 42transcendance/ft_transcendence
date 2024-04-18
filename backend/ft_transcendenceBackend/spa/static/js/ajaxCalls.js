



//Settings tab pfp load

document.addEventListener('DOMContentLoaded', function() {
    fetchUserSettings();

    function fetchUserSettings() {
        $.ajax({
            url: '/get_user_details/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                updateProfilePicture(data);
                updateSettingsUsername(data);
                if (data.user_details.userid) {
                    console.log("HEREEEEEEEEEEEEEEEEE");
                    userId = data.user_details.userid;
                    userUsername = data.user_details.username;
                }
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    function updateProfilePicture(data) {
        document.querySelector('.pfp-container .user-pfp').src = data.user_details.userPfp;
        document.querySelector('.profile-pic').src = data.user_details.userPfp;
    }
    function updateSettingsUsername(data){
        document.querySelector('.current-username').textContent = data.user_details.username;
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


