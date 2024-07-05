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
    window.location.href = CALLBACK_LINK, '_blank';
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
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
        });
}