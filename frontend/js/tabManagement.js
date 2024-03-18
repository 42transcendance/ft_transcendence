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

 
// showFriends();


/* toggling in friends button */

document.addEventListener('DOMContentLoaded', function() {
    // Directly hide specific content containers on load

    var friendTabs = document.querySelectorAll('.friend-tab-button');

    friendTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var contentId = this.id + 'Content';
            var contentDiv = document.getElementById(contentId);
            var isCurrentlyOpen = this.classList.contains('active-tab');

            // Close all tabs and contents
            friendTabs.forEach(function(t) {
                t.classList.remove('active-tab');
                var content = document.getElementById(t.id + 'Content');
                if (content) {
                    content.style.display = 'none'; // Ensure all contents are hidden
                }
                t.querySelector('.arrow-icon').classList.toggle('arrow-up', false);
            });

            // Toggle the clicked tab and its content
            if (!isCurrentlyOpen) {
                this.classList.add('active-tab');
                this.querySelector('.arrow-icon').classList.add('arrow-up');
                if (contentDiv) {
                    contentDiv.style.display = 'block'; // Show content
                }
            }
        });
    });
});






function toggleSetting(element) {
    element.classList.toggle("on");
}
















