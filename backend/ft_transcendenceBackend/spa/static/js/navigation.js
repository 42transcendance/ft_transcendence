let chatLan;
let settingsLan;
let profileLan;
let playLan;

function adjustGameContainerSize() {
    const gameContainer = document.getElementById('inner-container2');
    if (gameContainer) {
        const width = gameContainer.offsetWidth;
        const height = (2 / 3) * width;
        gameContainer.style.height = `${height}px`;
    }
}

function setContainerVisibility(container, isVisible, slideOutClass, slideInClass) {
    if (isVisible) {
        if (container.classList.contains(slideOutClass)) {
            container.classList.remove(slideOutClass);
            container.classList.add(slideInClass);
            container.style.visibility = 'visible';
            container.style.pointerEvents = 'auto';
            container.addEventListener('transitionend', () => {
                container.classList.remove(slideInClass);
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

function showTab(route) {
    var chatTab = document.querySelector('.chat-tab');
    var settingsTab = document.querySelector('.settings-tab');
    var profileTab = document.querySelector('.profile-tab');
    var gameTab = document.querySelector('.game-container');

    var firstTab = document.querySelector('.first-tab');
    var secondTab = document.querySelector('.second-tab');
    var thirdTab = document.querySelector('.third-tab');

    const gameContainer = document.getElementById('inner-container2');

    var navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(function(button) {
        button.classList.remove('active');
        if (button.getAttribute('data-button') === route) {
            button.classList.add('active');
        }
    });

    switch (route) {
        case 'play':
            injectBlock();
            adjustGameContainerSize();
            setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
            setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
            setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');
            // if (playLan != document.getElementById('selectLanguage').value) {
            //     updateLanguageModal("play");
            //     playLan = document.getElementById('selectLanguage').value
            // }
            chatTab.style.display = 'none';
            settingsTab.style.display = 'none';
            profileTab.style.display = 'none';
            gameTab.style.display = 'block';
            break;
        case 'chat':
            removeBlock();
            gameContainer.style.height = "75vh";
            setContainerVisibility(firstTab, true, 'left-slide-out', 'left-slide-in');
            setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
            setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');
            // if (chatLan != document.getElementById('selectLanguage').value) {
            //     updateLanguageModal("chat");
            //     chatLan = document.getElementById('selectLanguage').value
            // }
            chatTab.style.display = 'flex';
            settingsTab.style.display = 'none';
            profileTab.style.display = 'none';
            gameTab.style.display = 'none';
            break;
        case 'settings':
            removeBlock();
            gameContainer.style.height = "75vh";
            setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
            setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
            setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');
            // if (settingsLan != document.getElementById('selectLanguage').value) {
            //     updateLanguageModal("settings");
            //     settingsLan = document.getElementById('selectLanguage').value
            // }
            chatTab.style.display = 'none';
            settingsTab.style.display = 'block';
            profileTab.style.display = 'none';
            gameTab.style.display = 'none';
            break;
        case 'profile':
            removeBlock();
            gameContainer.style.height = "75vh";
            chatTab.style.display = 'none';
            settingsTab.style.display = 'none';
            profileTab.style.display = 'block';
            gameTab.style.display = 'none';
            // if (profileLan != document.getElementById('selectLanguage').value) {
            //     updateLanguageModal("profile");
            //     profileLan = document.getElementById('selectLanguage').value
            // }
            setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
            setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
            setContainerVisibility(thirdTab, true, 'right-slide-out', 'right-slide-in');
            // fetchUserData(userId);
            // fetchFriendsList();
            fetchUserSettings().then(() => {
                fetchFriendsList();
                fetchUserData(userId);
            }).catch(error => {
                console.error('Error fetching user settings:', error);
            });
            break;
    }
}

function navigate(route) {
    history.pushState(null, null, `#${route}`);
    showTab(route);
}

function navbarPressed(buttonPressed) {
    navigate(buttonPressed);
}

var navButtons = document.querySelectorAll('.nav-button');
var canPressButton = true;

navButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        if (!canPressButton) return;
        canPressButton = false;

        navButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const buttonPressed = this.getAttribute('data-button');
        navbarPressed(buttonPressed);

        setTimeout(function() {
            canPressButton = true;
        }, 500); 
    });
});

document.addEventListener('DOMContentLoaded', function() {
    chatLan = document.getElementById('selectLanguage').value;
    settingsLan = document.getElementById('selectLanguage').value;
    profileLan = document.getElementById('selectLanguage').value;
    playLan = document.getElementById('selectLanguage').value;

    var thirdTab = document.querySelector('.third-tab');

    thirdTab.classList.add('right-slide-out');

    const initialRoute = window.location.hash.substring(1) || 'chat';
    showTab(initialRoute);

    window.addEventListener('popstate', function() {
        const route = window.location.hash.substring(1);
        showTab(route);
    });
});
