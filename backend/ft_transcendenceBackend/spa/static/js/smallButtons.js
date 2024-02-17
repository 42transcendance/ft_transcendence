document.addEventListener('DOMContentLoaded', function() {
    var controllerIcons = document.querySelectorAll('.icon-controller');
    var blockIcons = document.querySelectorAll('.icon-block');

    controllerIcons.forEach(function(controller) {
        controller.addEventListener('click', function() {
            showNotification("Invitation Sent", "rgb(81, 171, 81)"); // Green color
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
            showNotification("User Blocked", "rgb(168, 64, 64"); // Red color
            removeModal('confirmBlockModal');
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
        var notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.backgroundColor = color;
        document.body.appendChild(notification);

        // Show the notification
        notification.style.display = 'block';

        // Hide the notification after 2 seconds
        setTimeout(function() {
            notification.style.display = 'none';
            document.body.removeChild(notification);
        }, 2000);
    }
});

