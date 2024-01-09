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