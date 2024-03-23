function removeBlurAndText() {
    var blurBackground = document.getElementById('blurBackground');
    var centeredText = document.getElementById('centeredText');
    console.log("remove");
    if (blurBackground) {
        blurBackground.parentNode.removeChild(blurBackground);
    }
    if (centeredText) {
        centeredText.parentNode.removeChild(centeredText);
    }
}

function redirectToLogin() {
    window.location.href ='https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a5afc4a5214c57269a802fc3629c48621c8edf6b99e531450eb5975de732483d&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fcallback&response_type=code', '_blank';
}

window.onload = function() {
        removeBlurAndText();
};

window.addEventListener("load", function() {
    const loader = document.getElementById("loading-container");
    loader.style.display = "none";
  });