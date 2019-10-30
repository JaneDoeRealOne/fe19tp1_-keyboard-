



document.addEventListener("DOMContentLoaded", function () {
    // Use this to access html elements when loaded
})

window.onload = function () {

    let container = document.querySelector('#modalContainer');
    container.style.opacity = '1';

    let btnModal = document.querySelector('#btnModal');
    btnModal.onclick = function () {

        container.style.opacity = '0';
       

        container.addEventListener('transitionend', () => {
            container.style.display = 'none';
        });
    }
}