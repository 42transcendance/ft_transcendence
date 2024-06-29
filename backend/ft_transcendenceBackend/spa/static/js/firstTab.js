
document.addEventListener('authenticated', function() {
    const friendsBtn = document.getElementById('button1');
    const chatsBtn = document.getElementById('button2');
    const friendsContainer = document.getElementById('friendsContainer');
    const chatsContainer = document.getElementById('chatsContainer');
    const chatsTabContent2 = document.getElementById('chatsTabContent2');
    checkAndUpdateChatItems();

    friendsBtn.addEventListener('click', () => showTab(friendsContainer, chatsContainer));
    chatsBtn.addEventListener('click', () => {
        showTab(chatsContainer, friendsContainer);
        checkAndUpdateChatItems();
    });

    function showTab(activeContainer, inactiveContainer) {
        activeContainer.style.display = 'block';
        inactiveContainer.style.display = 'none';
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


    async function checkAndUpdateChatItems() {
        try {
            const chatUsersResponse = await fetch('/get_chat_users/');
            const chatUsersData = await chatUsersResponse.json();

            const friendsResponse = await fetch('/get_friends/');
            const friendsData = await friendsResponse.json();
            const friendsIds = friendsData.friends.map(friend => friend.userid);

            const blockListResponse = await fetch('/get_block_list/');
            const blockListData = await blockListResponse.json();
            const blockedIds = blockListData.map(blocked => blocked.userid);

            if (chatUsersData.chat_users) {
                const existingChatItems = Array.from(chatsTabContent2.querySelectorAll('.chats-item'));
                const existingChatIds = existingChatItems.map(item => item.getAttribute('data-id'));

                existingChatItems.forEach(item => {
                    const userId = item.getAttribute('data-id');
                    if (!friendsIds.includes(userId) || blockedIds.includes(userId)) {
                        chatsTabContent2.removeChild(item);
                    }
                });

                chatUsersData.chat_users.forEach(user => {
                    const userId = user[0];
                    const userName = user[1];
                    const userPfp = user[2];

                    if (!existingChatIds.includes(userId) && friendsIds.includes(userId) && !blockedIds.includes(userId)) {
                        const chatItem = createChatItem(userId, userName, userPfp);
                        chatsTabContent2.appendChild(chatItem);
                    }
                });
            }
        } catch (error) {
            console.error('Error checking and updating chat items:', error);
        }
    }
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