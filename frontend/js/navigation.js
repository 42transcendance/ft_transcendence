var navButtons = document.querySelectorAll('.nav-button');
var canPressButton = true; // Variable to control button press

navButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        if (!canPressButton) return; // Prevent action if button press is not allowed
        canPressButton = false; // Disable further button presses

        navButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        setTimeout(function() {
            canPressButton = true; // Re-enable button presses after 1 second
        }, 300); // 1 second delay
    });
});




// function setInitialVisibility() {
//     setContainerVisibility(firstTab, true, 'left-slide-out', 'left-slide-in');
//     setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
//     setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');

//     chatTab.style.display = 'block';
//     settingsTab.style.display = 'none';
//     achievementsTab.style.display = 'none';
//     profileTab.style.display = 'none';
// }

// function setContainerVisibility(container, isVisible, slideOutClass, slideInClass) {
    
//     if (isVisible) {
//         if (container.classList.contains(slideOutClass)) {
//             container.classList.remove(slideOutClass);
//             container.classList.add(slideInClass);
//             container.style.visibility = 'visible';
//             container.style.pointerEvents = 'auto';
//             container.addEventListener('transitionend', () => {
//                 container.classList.remove(slideInClass); // Remove the slide-in class after animation
//             }, { once: true });
//         }
//     } else {
//         if (!container.classList.contains(slideOutClass)) {
//             container.classList.add(slideOutClass);
//             container.addEventListener('transitionend', function() {
//                 container.style.visibility = 'hidden';
//                 container.style.pointerEvents = 'none';
//             }, { once: true });
//         }
//     }
// }


// function updateTabVisibilityBasedOnActiveButton() {
//     if (gameIcon.classList.contains('active')) {
//         setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
//         setContainerVisibility(secondTab, false, 'middle-slide-out', 'middle-slide-in');
//         setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');

//         // Hide all tabs' content
//         chatTab.style.display = 'none';
//         settingsTab.style.display = 'none';
//         achievementsTab.style.display = 'none';
//         profileTab.style.display = 'none';
//     }
//     else if (chatIcon.classList.contains('active')) {
//         setContainerVisibility(firstTab, true, 'left-slide-out', 'left-slide-in');
//         setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
//         setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');

//         chatTab.style.display = 'block';
//         settingsTab.style.display = 'none';
//         achievementsTab.style.display = 'none';
//         profileTab.style.display = 'none';
//     }
//     else if (settingsIcon.classList.contains('active')) {
//         setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
//         setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
//         setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');

//         chatTab.style.display = 'none';
//         settingsTab.style.display = 'block';
//         achievementsTab.style.display = 'none';
//         profileTab.style.display = 'none';
//     }
//     else if (achievementsIcon.classList.contains('active')) {
//         setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
//         setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
//         setContainerVisibility(thirdTab, false, 'right-slide-out', 'right-slide-in');

//         chatTab.style.display = 'none';
//         settingsTab.style.display = 'block';
//         achievementsTab.style.display = 'none';
//         profileTab.style.display = 'none';
//     }
//     else if (profileIcon.classList.contains('active')) {
//         setContainerVisibility(firstTab, false, 'left-slide-out', 'left-slide-in');
//         setContainerVisibility(secondTab, true, 'middle-slide-out', 'middle-slide-in');
//         setContainerVisibility(thirdTab, true, 'right-slide-out', 'right-slide-in');

//         chatTab.style.display = 'none';
//         settingsTab.style.display = 'none';
//         achievementsTab.style.display = 'none';
//         profileTab.style.display = 'block';
//     }
// }


// document.addEventListener('DOMContentLoaded', function() {
    
    
//     var navButtons = document.querySelectorAll('.nav-button');
//     var canPressButton = true; // Variable to control button press
    
    
//     // Define icons and tabs
//     var chatIcon = document.querySelector('.chat');
//     var settingsIcon = document.querySelector('.settings');
//     var achievementsIcon = document.querySelector('.achievements');
//     var profileIcon = document.querySelector('.friends');
//     var gameIcon = document.querySelector('.play');

//     var chatTab = document.querySelector('.chat-tab');
//     var settingsTab = document.querySelector('.settings-tab');
//     var achievementsTab = document.querySelector('.achievements-tab');
//     var profileTab = document.querySelector('.profile-tab');
    
//     // Define container divs
//     var firstTab = document.querySelector('.first-tab');
//     var secondTab = document.querySelector('.second-tab');
//     var thirdTab = document.querySelector('.third-tab');
    
//     // Set initial visibility of the tabs
//     setInitialVisibility();
    
//     navButtons.forEach(function(button) {
    
        
//         button.addEventListener('click', function() {
//             if (!canPressButton) return; // Prevent action if button press is not allowed
//             canPressButton = false; // Disable further button presses
    
//             navButtons.forEach(btn => btn.classList.remove('active'));
//             this.classList.add('active');

//             updateTabVisibilityBasedOnActiveButton();

//             setTimeout(function() {
//                 canPressButton = true; // Re-enable button presses after 1 second
//             }, 700); // 1 second delay
//         });
//     });
// });