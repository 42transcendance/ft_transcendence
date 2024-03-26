document.addEventListener('DOMContentLoaded', function() {
    fetchUserProfile();

    function fetchUserProfile() {
        $.ajax({
            url: '/get_user_profile/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                updateProfilePage(data);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    function updateProfilePage(data) {
        console.log("calling");
        // Replacing keys with actual ones from our API response
        document.getElementById('username').textContent = data.user_details.username;
        document.getElementById('userPfp').src = data.user_details.userPfp || 'assets/pfp.png';
        document.getElementById('joinedDate').textContent = `Joined: ${data.user_details.joinedDate}`;
        // document.getElementById('ranking').textContent = `Ranking: ${data.rank}`;
        // document.getElementById('matchesPlayed').textContent = `Matches Played: ${data.gamesPlayed}`;
    }
});
