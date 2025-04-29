function loadHeader() {
    fetch('/components/header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('body').insertAdjacentHTML('afterbegin', data);
        })
        .catch(error => console.error('Error loading header:', error));
}

// Load header when the page loads
document.addEventListener('DOMContentLoaded', loadHeader); 