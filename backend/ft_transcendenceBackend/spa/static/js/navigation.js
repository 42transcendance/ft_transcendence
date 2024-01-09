var navButtons = document.querySelectorAll('.nav-button');

navButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        navButtons.forEach(btn => btn.classList.remove('active'));

        this.classList.add('active');
    });
});

