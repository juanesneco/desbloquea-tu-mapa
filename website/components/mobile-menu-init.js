// Función para inicializar el menú móvil
// Se ejecuta después de que el header es cargado
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const menuLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuBtn) {
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (overlay) {
                overlay.classList.add('active');
                console.log('Menu abierto');
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (overlay) {
                overlay.classList.remove('active');
                console.log('Menu cerrado');
            }
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                console.log('Menu cerrado (click fuera)');
            }
        });
    }

    if (menuLinks) {
        menuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (overlay) {
                    overlay.classList.remove('active');
                    console.log('Menu cerrado (click en link)');
                }
            });
        });
    }
    
    console.log('✅ Menú móvil inicializado', {menuBtn, closeBtn, overlay});
}

