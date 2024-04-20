// FRIENDS AND CHATS :: CHATS

document.addEventListener('DOMContentLoaded', function() {
    const friendsBtn = document.getElementById('button1');
    const chatsBtn = document.getElementById('button2');
    const friendsContainer = document.getElementById('friendsContainer');
    const chatsContainer = document.getElementById('chatsContainer');
    const chatsTabContent2 = document.getElementById('chatsTabContent2');

    // Event listeners for tab buttons
    friendsBtn.addEventListener('click', () => showTab(friendsContainer, chatsContainer));
    chatsBtn.addEventListener('click', () => showTab(chatsContainer, friendsContainer));

    function showTab(activeContainer, inactiveContainer) {
        activeContainer.style.display = 'block';
        inactiveContainer.style.display = 'none';
        activeContainer === chatsContainer ? fetchChats() : null;
        updateTabButtonStyles(activeContainer);
    }

    function updateTabButtonStyles(activeContainer) {
        if (activeContainer === chatsContainer) {
            chatsBtn.classList.add('active');
            friendsBtn.classList.remove('active');
        } else {
            friendsBtn.classList.add('active');
            chatsBtn.classList.remove('active');
        }
    }

    function fetchChats() {
        $.ajax({
            url: '/api/chats', // REPLACE !!!
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                displayChats(data.chats);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching chats:', error);
                displayErrorInChatContainer('Failed to load chats.');
            }
        });
    }

    function displayChats(chats) {
        chatsTabContent2.innerHTML = '';

        chats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chats-item';
            chatItem.setAttribute('data-user-id', chat.userId);

            chatItem.innerHTML = `
                <img src="${chat.profilePicture || 'assets/pfp.png'}" alt="${chat.name}" class="friend-image">
                <div class="friend-info">
                    <div>${chat.name}</div>
                </div>
                <i class="bi bi-chat chats-chat icon-chat"></i>
                <i class="bi bi-gear chats-settings icon-settings"></i>
            `;
            chatsTabContent2.appendChild(chatItem);
        });
    }

    function displayErrorInChatContainer(message) {
        chatsTabContent2.innerHTML = `<p class="error">${message}</p>`;
    }

    // Handling clicks on chat icons and settings within chatsTabContent2
    chatsTabContent2.addEventListener('click', function(event) {
        if (event.target.classList.contains('icon-chat')) {
            const userId = event.target.closest('.chats-item').getAttribute('data-user-id');
            openChat(userId);
        } else if (event.target.classList.contains('icon-settings')) {
            const userId = event.target.closest('.chats-item').getAttribute('data-user-id');
            openSettings(userId);
        }
    });

    function openChat(userId) {
        console.log('Open chat with user:', userId);
        // Implement your logic to open chat
    }

    function openSettings(userId) {
        console.log('Open settings for user:', userId);
        // Implement your logic to open settings
    }
});


// FRIENDS AND CHATS :: EFFECT

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