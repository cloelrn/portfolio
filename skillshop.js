// ===== DONNÉES DU CATALOGUE (OPTION A : CATALOGUE FIXE) =====
const skillsCatalog = [
    {
        id: 1,
        name: "CSS Flexbox & Grid",
        price: 100,
        description: "Maîtrise de la mise en page moderne avec Flexbox et Grid CSS",
        icon: "🎨"
    },
    {
        id: 2,
        name: "Vanilla JavaScript",
        price: 200,
        description: "Maîtrise de la syntaxe et de l'utilisation de JavaScript pur",
        icon: "⚡"
    },
    {
        id: 3,
        name: "HTML5 Sémantique",
        price: 80,
        description: "Utilisation correcte des balises sémantiques HTML5",
        icon: "📝"
    },
    {
        id: 4,
        name: "Responsive Design",
        price: 150,
        description: "Création de sites web adaptatifs pour tous les écrans",
        icon: "📱"
    },
    {
        id: 5,
        name: "Git & GitHub",
        price: 120,
        description: "Gestion de versions et collaboration avec Git",
        icon: "🔧"
    },
    {
        id: 6,
        name: "API REST",
        price: 250,
        description: "Consommation et création d'APIs RESTful",
        icon: "🌐"
    },
    {
        id: 7,
        name: "Accessibilité Web",
        price: 130,
        description: "Rendre les sites accessibles à tous les utilisateurs",
        icon: "♿"
    },
    {
        id: 8,
        name: "Performance Web",
        price: 180,
        description: "Optimisation de la vitesse et des performances",
        icon: "⚡"
    },
    {
        id: 9,
        name: "SEO",
        price: 160,
        description: "Optimisation pour les moteurs de recherche",
        icon: "🔍"
    },
    {
        id: 10,
        name: "JavaScript Async",
        price: 220,
        description: "Gestion avancée de l'asynchrone (Promises, async/await)",
        icon: "🔄"
    },
    {
        id: 11,
        name: "CSS Animations",
        price: 140,
        description: "Création d'animations et transitions CSS fluides",
        icon: "✨"
    },
    {
        id: 12,
        name: "LocalStorage & Sessions",
        price: 110,
        description: "Gestion du stockage local et des sessions",
        icon: "💾"
    }
];

// ===== GESTION DE L'ÉTAT DE L'APPLICATION =====
class SkillShopApp {
    constructor() {
        this.credits = 500; // Solde initial
        this.cart = []; // Panier
        this.acquiredSkills = []; // Compétences acquises
        this.bonusInterval = null;
        this.productionCooldown = false;
        
        this.init();
    }

    // Initialisation de l'application
    init() {
        this.loadFromLocalStorage();
        this.renderCatalog();
        this.updateUI();
        this.setupEventListeners();
        this.startRandomBonusSystem();
    }

    // ===== LOCALSTORAGE =====
    saveToLocalStorage() {
        const state = {
            credits: this.credits,
            cart: this.cart,
            acquiredSkills: this.acquiredSkills
        };
        localStorage.setItem('skillShopState', JSON.stringify(state));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('skillShopState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.credits = state.credits || 500;
                this.cart = state.cart || [];
                this.acquiredSkills = state.acquiredSkills || [];
            } catch (e) {
                console.error('Erreur lors du chargement des données:', e);
            }
        }
    }

    // ===== RENDU DU CATALOGUE =====
    renderCatalog() {
        const catalogGrid = document.getElementById('catalogGrid');
        catalogGrid.innerHTML = '';

        skillsCatalog.forEach(skill => {
            const isAcquired = this.acquiredSkills.some(s => s.id === skill.id);
            const isInCart = this.cart.some(s => s.id === skill.id);

            const skillCard = document.createElement('div');
            skillCard.className = `skill-card ${isAcquired ? 'acquired' : ''}`;
            skillCard.dataset.skillId = skill.id;

            skillCard.innerHTML = `
                <span class="skill-icon">${skill.icon}</span>
                <h3 class="skill-name">${skill.name}</h3>
                <p class="skill-description">${skill.description}</p>
                <div class="skill-price">
                    <span class="price-tag">${skill.price} crédits</span>
                </div>
                <button 
                    class="add-to-cart-btn ${isInCart ? 'in-cart' : ''}" 
                    data-skill-id="${skill.id}"
                    ${isAcquired ? 'disabled' : ''}
                >
                    ${isAcquired ? '✓ Acquise' : isInCart ? 'Dans le panier' : 'Ajouter au panier'}
                </button>
            `;

            // Interaction au survol (micro-interaction visuelle)
            skillCard.addEventListener('mouseenter', (e) => {
                if (!isAcquired) {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                }
            });

            skillCard.addEventListener('mouseleave', (e) => {
                e.currentTarget.style.transform = '';
            });

            catalogGrid.appendChild(skillCard);
        });
    }

    // ===== GESTION DU PANIER =====
    addToCart(skillId) {
        const skill = skillsCatalog.find(s => s.id === skillId);
        if (!skill) return;

        // Vérifier si déjà acquise
        if (this.acquiredSkills.some(s => s.id === skillId)) {
            this.showMessage('Cette compétence est déjà acquise !', 'error');
            return;
        }

        // Vérifier si déjà dans le panier
        if (this.cart.some(s => s.id === skillId)) {
            this.showMessage('Cette compétence est déjà dans le panier !', 'error');
            return;
        }

        this.cart.push(skill);
        this.saveToLocalStorage();
        this.updateUI();
        this.showMessage(`${skill.name} ajoutée au panier !`, 'success');
    }

    removeFromCart(skillId) {
        this.cart = this.cart.filter(s => s.id !== skillId);
        this.saveToLocalStorage();
        this.updateUI();
    }

    clearCart() {
        if (this.cart.length === 0) {
            this.showMessage('Le panier est déjà vide !', 'error');
            return;
        }
        this.cart = [];
        this.saveToLocalStorage();
        this.updateUI();
        this.showMessage('Panier vidé !', 'success');
    }

    // ===== VALIDATION DE L'ACHAT =====
    validatePurchase() {
        if (this.cart.length === 0) {
            this.showMessage('Le panier est vide !', 'error');
            return;
        }

        const totalCost = this.cart.reduce((sum, skill) => sum + skill.price, 0);

        // Vérifier si le solde est suffisant
        if (this.credits < totalCost) {
            this.showMessage(
                `Solde insuffisant ! Il vous manque ${totalCost - this.credits} crédits.`,
                'error'
            );
            return;
        }

        // Effectuer la transaction
        this.credits -= totalCost;
        
        // Transférer vers les compétences acquises avec animation
        this.cart.forEach(skill => {
            this.acquiredSkills.push(skill);
        });

        const purchasedCount = this.cart.length;
        this.cart = [];
        
        this.saveToLocalStorage();
        this.updateUI();
        this.showMessage(
            `✅ Achat validé ! ${purchasedCount} compétence(s) acquise(s) !`,
            'success'
        );

        // Animation du solde
        this.animateCredits();
    }

    // ===== PRODUCTION DE CRÉDITS =====
    produceCredits(hours) {
        if (this.productionCooldown) {
            this.showMessage('Production en cours... Veuillez patienter.', 'error');
            return;
        }

        const creditsEarned = hours * 20;
        this.credits += creditsEarned;
        
        this.saveToLocalStorage();
        this.updateUI();
        
        // Afficher le message de production
        const productionMessage = document.getElementById('productionMessage');
        productionMessage.textContent = `✅ Production réussie ! +${creditsEarned} crédits`;
        productionMessage.className = 'production-message success';
        
        // Désactiver le bouton pendant 3 secondes
        this.productionCooldown = true;
        const productionBtn = document.getElementById('productionBtn');
        productionBtn.disabled = true;
        productionBtn.textContent = '⏳ Production en cours...';
        
        setTimeout(() => {
            this.productionCooldown = false;
            productionBtn.disabled = false;
            productionBtn.textContent = '🚀 Lancer la Production';
            productionMessage.textContent = '';
        }, 3000);

        this.animateCredits();
    }

    // ===== SYSTÈME DE BONUS ALÉATOIRE =====
    startRandomBonusSystem() {
        // Générer un bonus toutes les 30 à 60 secondes
        const scheduleNextBonus = () => {
            const delay = (30 + Math.random() * 30) * 1000; // 30-60 secondes
            this.bonusInterval = setTimeout(() => {
                this.showRandomBonus();
                scheduleNextBonus();
            }, delay);
        };
        scheduleNextBonus();
    }

    showRandomBonus() {
        const bonus = document.getElementById('randomBonus');
        
        // Position aléatoire sur l'écran
        const maxX = window.innerWidth - 150;
        const maxY = window.innerHeight - 150;
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        
        bonus.style.left = `${randomX}px`;
        bonus.style.top = `${randomY}px`;
        bonus.classList.remove('hidden');
        
        // Disparaît après 5 secondes
        const disappearTimeout = setTimeout(() => {
            bonus.classList.add('hidden');
        }, 5000);
        
        // Gestion du clic sur le bonus
        const bonusClickHandler = () => {
            clearTimeout(disappearTimeout);
            const bonusAmount = 20 + Math.floor(Math.random() * 31); // 20-50 crédits
            this.credits += bonusAmount;
            this.saveToLocalStorage();
            this.updateUI();
            this.showMessage(`🎉 Bonus ! +${bonusAmount} crédits`, 'success');
            bonus.classList.add('hidden');
            bonus.removeEventListener('click', bonusClickHandler);
            this.animateCredits();
        };
        
        bonus.addEventListener('click', bonusClickHandler, { once: true });
    }

    // ===== MISE À JOUR DE L'INTERFACE =====
    updateUI() {
        // Mettre à jour le solde
        document.getElementById('creditBalance').textContent = this.credits;

        // Mettre à jour les compétences acquises
        const acquiredList = document.getElementById('acquiredSkillsList');
        if (this.acquiredSkills.length === 0) {
            acquiredList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <p class="empty-text">Aucune compétence acquise</p>
                    <p class="empty-subtext">Commencez par explorer le catalogue</p>
                </div>
            `;
        } else {
            acquiredList.innerHTML = this.acquiredSkills.map(skill => `
                <div class="skill-acquired-item">
                    <div class="skill-acquired-name">${skill.icon} ${skill.name}</div>
                    <div class="skill-acquired-desc">${skill.description}</div>
                </div>
            `).join('');
        }

        // Mettre à jour le panier
        const cartItems = document.getElementById('cartItems');
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-state small">
                    <p class="empty-text">Votre panier est vide</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.cart.map(skill => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${skill.icon} ${skill.name}</div>
                        <div class="cart-item-price">${skill.price} crédits</div>
                    </div>
                    <button class="remove-from-cart-btn" data-skill-id="${skill.id}">
                        ✕
                    </button>
                </div>
            `).join('');
        }

        // Mettre à jour le total du panier
        const totalCost = this.cart.reduce((sum, skill) => sum + skill.price, 0);
        document.getElementById('cartTotal').textContent = `${totalCost} crédits`;

        // Re-rendre le catalogue pour mettre à jour les états
        this.renderCatalog();
    }

    // ===== ANIMATION DU SOLDE =====
    animateCredits() {
        const creditElement = document.getElementById('creditBalance');
        creditElement.style.transform = 'scale(1.3)';
        creditElement.style.color = '#10b981';
        
        setTimeout(() => {
            creditElement.style.transform = '';
            creditElement.style.color = '';
        }, 300);
    }

    // ===== AFFICHAGE DES MESSAGES =====
    showMessage(message, type) {
        const messageBox = document.getElementById('messageBox');
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`;
        messageBox.classList.remove('hidden');

        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 4000);
    }

    // ===== GESTION DES ÉVÉNEMENTS =====
    setupEventListeners() {
        // Délégation d'événements pour les boutons d'ajout au panier
        document.getElementById('catalogGrid').addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const skillId = parseInt(e.target.dataset.skillId);
                this.addToCart(skillId);
            }
        });

        // Délégation pour les boutons de suppression du panier
        document.getElementById('cartItems').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-from-cart-btn') || 
                e.target.parentElement.classList.contains('remove-from-cart-btn')) {
                const button = e.target.classList.contains('remove-from-cart-btn') 
                    ? e.target 
                    : e.target.parentElement;
                const skillId = parseInt(button.dataset.skillId);
                this.removeFromCart(skillId);
            }
        });

        // Bouton vider le panier
        document.getElementById('clearCartBtn').addEventListener('click', () => {
            this.clearCart();
        });

        // Bouton valider l'achat
        document.getElementById('validatePurchaseBtn').addEventListener('click', () => {
            this.validatePurchase();
        });

        // Formulaire de production
        document.getElementById('productionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const hours = parseInt(document.getElementById('productionTime').value);
            if (hours > 0 && hours <= 24) {
                this.produceCredits(hours);
            } else {
                this.showMessage('Veuillez entrer un nombre d\'heures valide (1-24)', 'error');
            }
        });

        // Toggle du panier
        document.getElementById('toggleCartBtn').addEventListener('click', () => {
            this.toggleCart();
        });

        // ===== RACCOURCIS CLAVIER =====
        document.addEventListener('keydown', (e) => {
            // C = Vider le panier
            if (e.key.toLowerCase() === 'c' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.clearCart();
            }
            
            // P = Masquer/Afficher le panier
            if (e.key.toLowerCase() === 'p' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.toggleCart();
            }
        });
    }

    // Basculer l'affichage du panier
    toggleCart() {
        const cartSection = document.getElementById('cartSection');
        cartSection.classList.toggle('hidden-cart');
    }
}

// ===== INITIALISATION DE L'APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.skillShopApp = new SkillShopApp();
    console.log('🎯 Skill-Shop initialisé avec succès !');
});
