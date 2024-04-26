document.addEventListener('DOMContentLoaded', function() {
    var controllerIcons = document.querySelectorAll('.icon-controller');
    var blockIcons = document.querySelectorAll('.icon-block');

    controllerIcons.forEach(function(controller) {
        controller.addEventListener('click', function() {
            showNotification("Invitation Sent", "rgb(81, 171, 81)");
        });
    });

    blockIcons.forEach(function(blockIcon) {
        blockIcon.addEventListener('click', function() {
            showConfirmBlockModal();
        });
    });

    function showConfirmBlockModal() {
        const modalHtml = `
            <div id="confirmBlockModal" class="modal-overlay">
                <div class="modal-content">
                    <h3>Block User</h3>
                    <p>Are you sure you want to block this user?</p>
                    <div class="modal-buttons">
                        <button id="btnConfirmBlock" class="modal-button modal-button-add">Yes</button>
                        <button id="btnCancelBlock" class="modal-button modal-button-cancel">No</button>
                    </div>
                </div>
            </div>
        `;  
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        addModalEventListeners();
    }

    function addModalEventListeners() {
        document.getElementById('btnConfirmBlock').addEventListener('click', function() {
            $.ajax({
                url: '/block_friend/',
                method: 'GET',
                data: { 'friend_username': username },
                success: function(data) {
                    showNotification("User Blocked", "rgb(168, 64, 64");
                    removeModal('confirmBlockModal');
                }
            });
            
        });

        document.getElementById('btnCancelBlock').addEventListener('click', function() {
            removeModal('confirmBlockModal');
        });
    }

    function removeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.parentNode.removeChild(modal);
    }

    function showNotification(message, color) {
        $.ajax({
            url: '/get_notif_translate/',
            method: 'GET',
            data: { 'message': message },
            success: function(data) {
                var notification = document.createElement('div');
                notification.className = 'notification';
                notification.textContent = data.translations.message;
                notification.style.backgroundColor = color;
                document.body.appendChild(notification);
        
                notification.style.display = 'block';
        
                setTimeout(function() {
                    notification.style.display = 'none';
                    document.body.removeChild(notification);
                }, 2000);
            }
        });
        
    }
});

// general chat nickname icons

// document.addEventListener('DOMContentLoaded', () => {
//     const toggleButton = document.querySelector('.toggle-icons'); // Get the arrow icon
//     const iconsContainer = document.querySelector('.messageIcons'); // Get the icons container

//     toggleButton.addEventListener('click', () => {
//         iconsContainer.classList.toggle('active');

//         if (toggleButton.classList.contains('bi-caret-right-fill')) {
//             toggleButton.classList.remove('bi-caret-right-fill');
//             toggleButton.classList.add('bi-caret-left-fill');
//         } else {
//             toggleButton.classList.remove('bi-caret-left-fill');
//             toggleButton.classList.add('bi-caret-right-fill');
//         }
//     });
// });


document.addEventListener('DOMContentLoaded', () => {
    const nicknameElement = document.querySelector('.nicknameAndIcon');
    const iconsContainer = nicknameElement.querySelector('.messageIcons');

    nicknameElement.addEventListener('mouseenter', () => {
        iconsContainer.style.display = 'flex';  // Show the icons
    });

    nicknameElement.addEventListener('mouseleave', () => {
        iconsContainer.style.display = 'none';  // Hide the icons
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const chatMessagesContainer = document.querySelector('.chat-messages');

    chatMessagesContainer.addEventListener('click', function(event) {
        const target = event.target;

        if (target.classList.contains('messageIcon')) {
            const parentContainer = target.closest('.nicknameAndIcon');
            const senderId = parentContainer.querySelector('.nickname').id;
            console.log("Icon clicked belongs to sender ID:", senderId);
            handleIconClick(senderId, target);
        }
    });
});

function handleIconClick(senderId, iconElement) {
    console.log(`Action triggered for ${senderId} by clicking on`, iconElement);
    switch (iconElement.className.split(' ')[1]) {
        case 'bi-controller':
            console.log("Controller icon clicked for user:", senderId);
            break;
        case 'bi-plus-circle':
            console.log("Plus circle icon clicked for user:", senderId);
            break;
        case 'bi-person':
            console.log("Person icon clicked for user:", senderId);
            break;
        default:
            console.log("Unknown icon clicked for user:", senderId);
    }
}

