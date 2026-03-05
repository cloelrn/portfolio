// === PORTFOLIO BENTO BOX MULTI-PAGES - JAVASCRIPT ===

document.addEventListener('DOMContentLoaded', function() {
    
    // === Curseur Custom Flèche ===
    const cursorArrow = document.querySelector('.cursor-arrow');
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        const speed = 0.15;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        if (cursorArrow) {
            cursorArrow.style.left = cursorX + 'px';
            cursorArrow.style.top = cursorY + 'px';
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Agrandir le curseur sur hover des éléments interactifs
    const hoverElements = document.querySelectorAll('a, button, .project-card');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (cursorArrow) {
                cursorArrow.style.transform = 'scale(1.5)';
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (cursorArrow) {
                cursorArrow.style.transform = 'scale(1)';
            }
        });
    });
    
    // === Menu Burger Toggle ===
    const menuBurger = document.querySelector('.menu-burger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuBurger && navMenu) {
        // Toggle menu
        menuBurger.addEventListener('click', () => {
            menuBurger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Mettre à jour aria-expanded
            const isExpanded = navMenu.classList.contains('active');
            menuBurger.setAttribute('aria-expanded', isExpanded);
            
            // Empêcher le scroll quand le menu est ouvert
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Fermer le menu au clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBurger.classList.remove('active');
                navMenu.classList.remove('active');
                menuBurger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Fermer le menu au clic extérieur
        document.addEventListener('click', (e) => {
            if (!menuBurger.contains(e.target) && !navMenu.contains(e.target)) {
                menuBurger.classList.remove('active');
                navMenu.classList.remove('active');
                menuBurger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Fermer le menu avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                menuBurger.classList.remove('active');
                navMenu.classList.remove('active');
                menuBurger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
    
    // === Animations au Scroll (Intersection Observer) ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les cartes
    const animatedElements = document.querySelectorAll('.intro-card, .project-card, .about-card, .info-card');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // === Animation des barres de niveau de langue ===
    const languageBars = document.querySelectorAll('.level-bar');
    
    const languageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const level = bar.style.getPropertyValue('--level');
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = level;
                }, 200);
            }
        });
    }, { threshold: 0.5 });
    
    languageBars.forEach(bar => {
        languageObserver.observe(bar);
    });
    
    // === Validation Formulaire Contact ===
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (contactForm && successMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Récupérer les valeurs
            const nom = document.getElementById('nom');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            let isValid = true;
            
            // Validation nom
            if (nom.value.trim() === '') {
                showError(nom, 'Veuillez entrer votre nom');
                isValid = false;
            } else {
                clearError(nom);
            }
            
            // Validation email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '') {
                showError(email, 'Veuillez entrer votre email');
                isValid = false;
            } else if (!emailRegex.test(email.value)) {
                showError(email, 'Veuillez entrer un email valide');
                isValid = false;
            } else {
                clearError(email);
            }
            
            // Validation message
            if (message.value.trim() === '') {
                showError(message, 'Veuillez entrer un message');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showError(message, 'Le message doit contenir au moins 10 caractères');
                isValid = false;
            } else {
                clearError(message);
            }
            
            // Si tout est valide
            if (isValid) {
                // Masquer le formulaire et afficher le message de succès
                contactForm.style.display = 'none';
                successMessage.style.display = 'flex';
                
                // Réinitialiser le formulaire
                contactForm.reset();
                
                // Réafficher le formulaire après 5 secondes
                setTimeout(() => {
                    successMessage.style.display = 'none';
                    contactForm.style.display = 'block';
                }, 5000);
            }
        });
    }
    
    function showError(input, message) {
        // Ajouter une bordure rouge
        input.style.borderColor = '#E89B95';
        
        // Supprimer l'ancien message d'erreur s'il existe
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Créer et ajouter le message d'erreur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#E89B95';
        errorDiv.style.fontSize = '13px';
        errorDiv.style.fontWeight = '600';
        errorDiv.style.marginTop = '6px';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }
    
    function clearError(input) {
        input.style.borderColor = '';
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // === Parallaxe subtil sur l'année flottante ===
    const yearFloat = document.querySelector('.year-float');
    
    if (yearFloat) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            yearFloat.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
    }
    
    // === Animation des badges au chargement ===
    const badges = document.querySelectorAll('.badge');
    
    badges.forEach((badge, index) => {
        badge.style.opacity = '0';
        badge.style.transform = 'scale(0)';
        
        setTimeout(() => {
            badge.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            badge.style.opacity = '1';
            badge.style.transform = 'scale(1)';
        }, 300 + (index * 150));
    });
    
    // === Effet de typing sur le titre hero (optionnel) ===
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroTitle) {
        // Animation d'apparition
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 800);
    }
    
    // === Effet de rotation aléatoire sur les sparkles ===
    const sparkles = document.querySelectorAll('.sparkle');
    
    sparkles.forEach(sparkle => {
        setInterval(() => {
            const randomRotation = Math.random() * 360;
            sparkle.style.transform = `rotate(${randomRotation}deg)`;
        }, 3000);
    });
    
    // === Gestion du scroll - Changer le style de la nav ===
    const nav = document.querySelector('.nav-bento');
    
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            } else {
                nav.style.boxShadow = 'none';
            }
        });
    }
    
    // === Animation Timeline Expériences ===
    const experienceCards = document.querySelectorAll('.experience-card');
    
    const experienceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    experienceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        experienceObserver.observe(card);
    });
    
    // === Console Easter Egg ===
    console.log('%c🎨 Portfolio Bento Box Multi-Pages', 'font-size: 24px; font-weight: bold; color: #A896C5;');
    console.log('%cDesigned with 💜 by Cloé Laurin', 'font-size: 14px; color: #6B6B6B;');
    console.log('%cStructure Multi-Pages avec Menu Burger', 'font-size: 12px; color: #E8A09D;');
    
});
