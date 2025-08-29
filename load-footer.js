document.addEventListener('DOMContentLoaded', function() {
    // Detect current path to determine correct relative path to footer.html
    const currentPath = window.location.pathname;
    const isInSubdirectory = currentPath.split('/').length > 2; // More than just domain and filename
    const footerPath = isInSubdirectory ? '../footer.html' : 'footer.html';
    
    fetch(footerPath)
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});
