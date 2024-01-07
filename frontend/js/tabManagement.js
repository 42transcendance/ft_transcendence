const friendsBtn = document.getElementById('button1');
const channelsBtn = document.getElementById('button2');
const historicBtn = document.getElementById('button3');
const friendslistBtn = document.getElementById('button4');
const friendsContainer = document.getElementById('friendsContainer');
const channelsContainer = document.getElementById('channelsContainer');
const HistoricContainer = document.getElementById('historicContainer');
const friendslistContainer = document.getElementById('friendslistContainer');

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

function showHistoric() {
    friendslistContainer.style.display = 'none';
    historicContainer.style.display = 'block';
    historicBtn.classList.add('active');
    friendslistBtn.classList.remove('active');
}

function showFriendsList() {
    friendslistContainer.style.display = 'block';
    historicContainer.style.display = 'none';
    friendslistBtn.classList.add('active');
    historicBtn.classList.remove('active');
}

friendsBtn.addEventListener('click', showFriends);
channelsBtn.addEventListener('click', showChannels);
historicBtn.addEventListener('click', showHistoric);
friendslistBtn.addEventListener('click', showFriendsList);

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


// containers visibility management
// Function to handle the visibility and animation of containers
function setContainerVisibility(container, isVisible, slideOutClass, slideInClass) {
    if (isVisible) {
        if (container.classList.contains(slideOutClass)) {
            container.classList.remove(slideOutClass);
            container.classList.add(slideInClass);
            container.style.visibility = 'visible';
            container.style.pointerEvents = 'auto';
            container.addEventListener('transitionend', () => {
                container.classList.remove(slideInClass); // Remove the slide-in class after animation
            }, { once: true });
        }
    } else {
        if (!container.classList.contains(slideOutClass)) {
            container.classList.add(slideOutClass);
            container.addEventListener('transitionend', function() {
                container.style.visibility = 'hidden';
                container.style.pointerEvents = 'none';
            }, { once: true });
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Define icons and tabs
    var chatIcon = document.querySelector('.chat');
    var settingsIcon = document.querySelector('.settings');
    var achievementsIcon = document.querySelector('.achievements');
    var profileIcon = document.querySelector('.friends');
    var gameIcon = document.querySelector('.play');

    var chatTab = document.querySelector('.chat-tab');
    var settingsTab = document.querySelector('.settings-tab');
    var achievementsTab = document.querySelector('.achievements-tab');
    var profileTab = document.querySelector('.profile-tab');

    // Define container divs
    var firstTab = document.querySelector('.first-tab');
    var secondTab = document.querySelector('.second-tab');
    var thirdTab = document.querySelector('.third-tab');

    // Set initial visibility of the tabs
    setInitialVisibility();

    function setInitialVisibility() {
        setContainerVisibility(firstTab, true, 'left-slide-out', 'left-slide-in');
        setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
        setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');

        chatTab.style.display = 'block';
        settingsTab.style.display = 'none';
        achievementsTab.style.display = 'none';
        profileTab.style.display = 'none';
    }

    gameIcon.addEventListener('click', function() {
        setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
        setContainerVisibility(secondTab, false, 'middle-slide-out', 'middle-slide-in');
        setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');

        // Hide all tabs' content
        chatTab.style.display = 'none';
        settingsTab.style.display = 'none';
        achievementsTab.style.display = 'none';
        profileTab.style.display = 'none';
    });

    // Event listeners for each icon to control tab visibility
    chatIcon.addEventListener('click', function() {
        setContainerVisibility(firstTab, true, 'left-slide-out', 'left-slide-in');
        setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
        setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');

        chatTab.style.display = 'block';
        settingsTab.style.display = 'none';
        achievementsTab.style.display = 'none';
        profileTab.style.display = 'none';
    });

    settingsIcon.addEventListener('click', function() {
        setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
        setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
        setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');

        chatTab.style.display = 'none';
        settingsTab.style.display = 'block';
        achievementsTab.style.display = 'none';
        profileTab.style.display = 'none';
    });

    achievementsIcon.addEventListener('click', function() {
        setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
        setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
        setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');

        chatTab.style.display = 'none';
        settingsTab.style.display = 'none';
        achievementsTab.style.display = 'block';
        profileTab.style.display = 'none';
    });

    profileIcon.addEventListener('click', function() {
        setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
        setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
        setContainerVisibility(thirdTab, true, 'right-slide-out', 'right-slide-in');

        chatTab.style.display = 'none';
        settingsTab.style.display = 'none';
        achievementsTab.style.display = 'none';
        profileTab.style.display = 'block';
    });
});



function toggleSetting(element) {
    element.classList.toggle("on");
}
