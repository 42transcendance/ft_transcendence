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

