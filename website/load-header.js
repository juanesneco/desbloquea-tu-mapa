document.addEventListener('DOMContentLoaded', function() {
    // Detect current path to determine correct relative path to header.html
    const currentPath = window.location.pathname;
    const isInSubdirectory = currentPath.split('/').length > 2; // More than just domain and filename
    const headerPath = isInSubdirectory ? '../header.html' : 'header.html';
    
    fetch(headerPath)
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));
}); 