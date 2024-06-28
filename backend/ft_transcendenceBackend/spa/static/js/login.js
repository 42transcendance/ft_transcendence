function removeBlurAndText() {
    var blurBackground = document.getElementById('blurBackground');
    var centeredText = document.getElementById('centeredText');
    if (blurBackground) {
        blurBackground.parentNode.removeChild(blurBackground);
    }
    if (centeredText) {
        centeredText.parentNode.removeChild(centeredText);
    }
}

function redirectToLogin() {
    window.location.href ='https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a5afc4a5214c57269a802fc3629c48621c8edf6b99e531450eb5975de732483d&redirect_uri=https%3A%2F%2Flocalhost%3A8000%2Fcallback&response_type=code', '_blank';
}

window.onload = function() {
    checkAuthentication(function(isAuthenticated) {
        if (isAuthenticated) {
            removeBlurAndText();
        }
    });
};

window.addEventListener("load", function() {
    const loader = document.getElementById("loading-container");
    loader.style.display = "none";
  });

  function checkAuthentication(callback) {
    fetch('/check_authentication/')
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                document.dispatchEvent(new CustomEvent('authenticated'));
                if (callback) callback(true);
            } else {
                console.log('User is not authenticated');
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
        });
}