
var navButtons = document.querySelectorAll('.nav-button');

navButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        navButtons.forEach(btn => btn.classList.remove('active'));

        this.classList.add('active');
    });
});

const socialButtons = document.querySelectorAll('.social-button');

function makeButtonActive(event) {
    socialButtons.forEach(button => {
        button.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

socialButtons.forEach(button => {
    button.addEventListener('click', makeButtonActive);
});

const friendsBtn = document.getElementById('button1');
const channelsBtn = document.getElementById('button2');
const friendsContainer = document.getElementById('friendsContainer');
const channelsContainer = document.getElementById('channelsContainer');

function showFriends() {
    friendsContainer.style.display = 'block';
    channelsContainer.style.display = 'none';
    friendsBtn.classList.add('active');
    channelsBtn.classList.remove('active');
}

function showChannels() {
    friendsContainer.style.display = 'none';
    channelsContainer.style.display = 'block';
    channelsBtn.classList.add('active');
    friendsBtn.classList.remove('active');
}

friendsBtn.addEventListener('click', showFriends);
channelsBtn.addEventListener('click', showChannels);

// Initialize with Friends button active
showFriends();

/* toggling in friends button */

document.addEventListener('DOMContentLoaded', function() {
    var friendTabs = document.querySelectorAll('.friend-tab-button');

    friendTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var contentId = this.id + 'Content';
            var contentDiv = document.getElementById(contentId);
            var isCurrentlyOpen = this.classList.contains('active-tab');

            // Close and reset all tabs and contents
            friendTabs.forEach(function(t) {
                t.classList.remove('active-tab');
                t.querySelector('.arrow-icon').classList.remove('arrow-up');
            });

            document.querySelectorAll('.friends-tab-content').forEach(function(div) {
                div.style.display = 'none';
            });

            // Open the clicked tab
            if (!isCurrentlyOpen) {
                this.classList.add('active-tab');
                this.querySelector('.arrow-icon').classList.add('arrow-up');

                if (contentDiv) {
                    contentDiv.style.display = 'block';
                } else {
                    // Display "Not Found" if contentDiv is null
                    this.insertAdjacentHTML('afterend', "<div class='friends-tab-content' style='display: block;'><span style='color: #a00000;'>Not Found</span></div>");
                }
            } else if (contentDiv) {
                // Close the tab if it's already open
                contentDiv.style.display = 'none';
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var chatIcon = document.querySelector('.chat');
    var settingsIcon = document.querySelector('.settings');
    var achievementsIcon = document.querySelector('.achievements');
    var profileIcon = document.querySelector('.friends');
    var chatTab = document.querySelector('.chat-tab');
    var settingsTab = document.querySelector('.settings-tab');
    var achievementsTab = document.querySelector('.achievements-tab');
    var profileTab = document.querySelector('.profile-tab');

    chatIcon.addEventListener('click', function() {
        chatTab.style.display = 'block';
        settingsTab.style.display = 'none';
        achievementsTab.style.display = 'none';
        profileTab.style.display = 'none';
    });

    settingsIcon.addEventListener('click', function() {
        chatTab.style.display = 'none';
        settingsTab.style.display = 'block';
        achievementsTab.style.display = 'none';
        profileTab.style.display = 'none';
    });

    achievementsIcon.addEventListener('click', function() {
        chatTab.style.display = 'none';
        settingsTab.style.display = 'none';
        achievementsTab.style.display = 'block';
        profileTab.style.display = 'none';
    });

    profileIcon.addEventListener('click', function() {
        chatTab.style.display = 'none';
        settingsTab.style.display = 'none';
        achievementsTab.style.display = 'none';
        profileTab.style.display = 'block';
    });
});

function toggleSetting(element) {
    element.classList.toggle("on");
}



