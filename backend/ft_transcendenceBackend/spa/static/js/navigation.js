
// containers visibility management
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

function navbarPressed(buttonPressed ) {
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
    var gameTab = document.querySelector('.game-container');

    // Define container divs
    var firstTab = document.querySelector('.first-tab');
    var secondTab = document.querySelector('.second-tab');
    var thirdTab = document.querySelector('.third-tab');

    switch (buttonPressed) {
        case 'play':
            setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
            setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
            setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');
    
            // Hide all tabs' content
            chatTab.style.display = 'none';
            settingsTab.style.display = 'none';
            achievementsTab.style.display = 'none';
            profileTab.style.display = 'none';
            gameTab.style.display = 'block';
            break;
        case 'chat':
            setContainerVisibility(firstTab, true, 'left-slide-out', 'left-slide-in');
            setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
            setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');
    
            chatTab.style.display = 'flex';
            settingsTab.style.display = 'none';
            achievementsTab.style.display = 'none';
            profileTab.style.display = 'none';
            gameTab.style.display = 'none';
            break;
        case 'settings':
            setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
            setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
            setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');
    
            chatTab.style.display = 'none';
            settingsTab.style.display = 'block';
            achievementsTab.style.display = 'none';
            profileTab.style.display = 'none';
            gameTab.style.display = 'none';
            break;
        case 'achievements':
            setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
            setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
            setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');
    
            chatTab.style.display = 'none';
            settingsTab.style.display = 'none';
            achievementsTab.style.display = 'block';
            profileTab.style.display = 'none';
            gameTab.style.display = 'none';
            break;
        case 'profile':
            setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
            setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
            setContainerVisibility(thirdTab, true, 'right-slide-out', 'right-slide-in');
    
            chatTab.style.display = 'none';
            settingsTab.style.display = 'none';
            achievementsTab.style.display = 'none';
            profileTab.style.display = 'block';
            gameTab.style.display = 'none';
            break;
    }  
}


var navButtons = document.querySelectorAll('.nav-button');
var canPressButton = true; // Variable to control button press

navButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        if (!canPressButton) return; // Prevent action if button press is not allowed
        canPressButton = false; // Disable further button presses

        navButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const buttonPressed = this.getAttribute('data-button');
        navbarPressed(buttonPressed);

        setTimeout(function() {
            canPressButton = true; // Re-enable button presses after 1 second
        }, 500); // 1 second delay
    });
});




document.addEventListener('DOMContentLoaded', function() {
    var thirdTab = document.querySelector('.third-tab');

    // Set initial visibility of the tabs
    // setInitialVisibility();
    thirdTab.classList.add('right-slide-out');
});
