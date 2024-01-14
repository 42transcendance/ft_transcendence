function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function sendData(data){


    // Récupérer le jeton CSRF du cookie
    var csrfToken = getCookie('csrftoken');

    // Envoyer le jeton CSRF dans l'en-tête de la requête AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/interface/duelRegistration/recevoir_donnees/", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("X-CSRFToken", csrfToken);
    // ... autres paramètres de la requête ...
    xhr.send(JSON.stringify(data));

}

function runGame(){

    p1 = document.getElementById("Player1");
    p2 = document.getElementById("Player2");

    data = {p1: p1.value, p2: p2.value}
    
    if(p1.value.length > 0 &&  p2.value.length > 0 ){
        sendData(data);
        window.location.href = "http://127.0.0.1:8000/interface/duelRegistration/game/"
    }
    else{
        window.alert("Merci de renseigner les noms");
    }
}
