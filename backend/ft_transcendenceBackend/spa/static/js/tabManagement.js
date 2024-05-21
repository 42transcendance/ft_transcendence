

 
// showFriends();


/* toggling in friends button */

// document.addEventListener('DOMContentLoaded', function() {

//     var friendTabs = document.querySelectorAll('.friend-tab-button');

//     function fetchOutgoingRequests() {
//         $.ajax({
//             url: '/get_outgoing_requests/', 
//             method: 'GET',
//             dataType: 'json',
//             success: function(waiting_requests) {
//                 if (waiting_requests.length > 0) {
//                     displayRequests('outgoingRequestsTabContent', waiting_requests, 'outgoing');
//                 } else {
//                     displayEmpty('outgoingRequestsTabContent');
//                 }
//             },
//             error: function(xhr, status, error) {
//                 console.error(error);
//             }
//         });
//     }

// function fetchIncomingRequests() {
//     $.ajax({
//         url: '/get_incoming_requests/', 
//         method: 'GET',
//         dataType: 'json',
//         success: function(waiting_requests) {
//             if (waiting_requests.length > 0) {
//                 displayRequests('incomingRequestsTabContent', waiting_requests, 'incoming');
//             } else {
//                 displayEmpty('incomingRequestsTabContent');
//             }
//         },
//         error: function(xhr, status, error) {
//             console.error(error);
//         }
//     });
// }

//     function fetchBlockedContacts() {
//         $.ajax({
//             url: '/get_block_list/', 
//             method: 'GET',
//             dataType: 'json',
//             success: function(block_list) {
//                 if (block_list.length > 0) {
//                     displayBlocked('blockedTabContent', block_list);
//                 } else {
//                     displayEmpty('blockedTabContent');
//                 }
//             },
//             error: function(xhr, status, error) {
//                 console.error(error);
//             }
//         });
//     }



//     function displayRequests(containerId, requests, type) {
//         const container = document.getElementById(containerId);
//         container.innerHTML = '';
//         requests.forEach(request => {
//             let actionIcons = '';
//             if (type === 'incoming') {
//                 actionIcons = `
//                     <i class="bi bi-check-circle accept-request small-icons" data-id="${request.userid}"></i>
//                     <i class="bi bi-x-circle decline-request small-icons" data-id="${request.userid}"></i>
//                 `;
//             }
//             container.innerHTML += `
//                 <div class="friend-item" data-id="${request.userid}">
//                     <img src="${request.userPfp}" alt="${request.username}" class="friend-image">
//                     <div class="friend-info">
//                         <div>${request.username}</div>
//                     </div>
//                     ${actionIcons}
//                 </div>
//             `;
//         });
//     }    

//     function displayBlocked(containerId, blocked) {
//         const container = document.getElementById(containerId);
//         container.innerHTML = '';
//         blocked.forEach(block => {
//             container.innerHTML += `
//                 <div class="friend-item" data-id="${block.userid}">
//                     <img src="${block.userPfp}" alt="${block.username}" class="friend-image">
//                     <div class="friend-info">
//                         <div>${block.username}</div>
//                     </div>
//                     <i class="bi bi-x-circle icon-unblock small-icons" data-id="${block.uesrid}"></i>
//                 </div>
//             `;
//         });
//     }    

//     function displayEmpty(containerId) {
//         $.ajax({
//             url: '/get_empty_translate/',
//             method: 'GET',
//             dataType: 'json',
//             success: function(data) {
//                 const container = document.getElementById(containerId);
//                 container.innerHTML = `<div style='color: red;'>${data.translations.empty}</div>`;
//             }
//         });
//     }

//     friendTabs.forEach(function(tab) {
//         tab.addEventListener('click', function() {
//             var contentId = this.id + 'Content';
//             var contentDiv = document.getElementById(contentId);
//             var isCurrentlyOpen = this.classList.contains('active-tab');
            
//             function fetchTabData(tabId) {
//                 switch(tabId) {
//                     case 'friendsTab':
//                         fetchFriends();
//                         break;
//                     case 'outgoingRequestsTab':
//                         fetchOutgoingRequests();
//                         break;
//                     case 'incomingRequestsTab':
//                         fetchIncomingRequests();
//                         break;
//                     case 'blockedTab':
//                         fetchBlockedContacts();
//                         break;
//                     default:
//                         console.log('Unknown tab');
//                 }
//             }

//             // Close all tabs and contents
//             friendTabs.forEach(function(t) {
//                 t.classList.remove('active-tab');
//                 var content = document.getElementById(t.id + 'Content');
//                 if (content) {
//                     content.style.display = 'none'; // Ensure all contents are hidden
//                 }
//                 t.querySelector('.arrow-icon').classList.toggle('arrow-up', false);
//             });

//             // Toggle the clicked tab and its content
//             if (!isCurrentlyOpen) {
//                 this.classList.add('active-tab');
//                 this.querySelector('.arrow-icon').classList.add('arrow-up');
//                 if (contentDiv) {
//                     contentDiv.style.display = 'block'; // Show content
//                     fetchTabData(this.id);
//                 }
//             }
//         });
//     });
// });



function toggleSetting(element) {
    element.classList.toggle("on");
}