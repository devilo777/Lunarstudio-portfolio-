// Hardcoded Default Base Data Configuration Engine
const defaultDatabase = {
    logo: "https://placehold.co/100x100/8b5cf6/ffffff?text=LUNAR",
    portfolio: [
        { id: 1, title: "Liquid Esports Champion Poster", category: "Esports", image: "https://placehold.co/800x450/1e1b4b/ffffff?text=Esports+Concept" },
        { id: 2, title: "100 Days Hardcore Survival Minecraft", category: "Gaming", image: "https://placehold.co/800x450/0f172a/ffffff?text=Gaming+Thumbnail" },
        { id: 3, title: "Modern Minimalist Agency Layout", category: "Branding", image: "https://placehold.co/800x450/111827/ffffff?text=Identity+Branding" },
        { id: 4, title: "I Traveled To The Most Isolated Island", category: "IRL", image: "https://placehold.co/800x450/0c0a09/ffffff?text=IRL+Vlog+Thumbnail" },
        { id: 5, title: "Cyberpunk Event Promo Layout", category: "Posters", image: "https://placehold.co/800x450/180025/ffffff?text=Cyberpunk+Poster" }
    ],
    team: [
        { id: 1, name: "Manas", role: "GFX Lead Thumbnail Designer", image: "https://placehold.co/150x150/8b5cf6/ffffff?text=Manas" }
    ],
    reviews: [
        { id: 1, clientImage: "https://placehold.co/100x100/2563eb/ffffff?text=Client", text: "Amazing workflow structure. The final click-through rate on our video project spiked up to 14.2% within two hours.", rating: 5 }
    ]
};

// State Machine Handlers
function initializeEngine() {
    if (!localStorage.getItem('lunar_studio_db')) {
        localStorage.setItem('lunar_studio_db', JSON.stringify(defaultDatabase));
    }
    const db = JSON.parse(localStorage.getItem('lunar_studio_db'));
    
    // Core Global Render Passes
    updateGlobalLogos(db.logo);
    renderPortfolio(db.portfolio);
    renderTeam(db.team);
    renderReviews(db.reviews);
    setupScrollEffects();
    setupMobileNav();
    setupLightbox(db.portfolio);
    setupCounters();
}

function updateGlobalLogos(logoUrl) {
    document.getElementById('site-logo').src = logoUrl;
    document.querySelectorAll('.logo-ref').forEach(img => img.src = logoUrl);
}

// UI Rendering Passes
function renderPortfolio(items) {
    const target = document.getElementById('portfolio-grid');
    target.innerHTML = items.length === 0 ? '<p style="grid-column: 1/-1; text-align:center; color: #bdbdbd;">No items inside catalog yet.</p>' : '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = `portfolio-card`;
        card.setAttribute('data-category', item.category);
        card.setAttribute('data-id', item.id);
        card.innerHTML = `
            <div class="portfolio-thumb-wrapper">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="portfolio-info">
                <span class="badge">${item.category}</span>
                <h3>${item.title}</h3>
            </div>
        `;
        target.appendChild(card);
    });
}

function renderTeam(items) {
    const target = document.getElementById('team-grid');
    target.innerHTML = '';
    items.forEach(item => {
        const element = document.createElement('div');
        element.className = 'team-card';
        element.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${item.image}" alt="${item.name}" class="team-avatar">
            </div>
            <h3>${item.name}</h3>
            <p>${item.role}</p>
        `;
        target.appendChild(element);
    });
}

function renderReviews(items) {
    const target = document.getElementById('reviews-grid');
    target.innerHTML = '';
    items.forEach(item => {
        const element = document.createElement('div');
        element.className = 'review-card';
        let stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
        element.innerHTML = `
            <div class="review-user">
                <img src="${item.clientImage}" alt="Client Image" class="review-avatar">
                <div class="star-rating">${stars}</div>
            </div>
            <p>"${item.text}"</p>
        `;
        target.appendChild(element);
    });
}

// Filter Logic Dropdown Controller
document.getElementById('portfolio-filter').addEventListener('change', (e) => {
    const selection = e.target.value;
    const cards = document.querySelectorAll('.portfolio-card');
    
    cards.forEach(card => {
        if(selection === 'All' || card.getAttribute('data-category') === selection) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 10);
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
});

// Lightbox Structural Interactivity Logic
function setupLightbox(items) {
    const modal = document.getElementById('portfolio-modal');
    const modalImg = document.getElementById('modal-img');
    const modalBadge = document.getElementById('modal-badge');
    const modalTitle = document.getElementById('modal-title');
    
    document.getElementById('portfolio-grid').addEventListener('click', (e) => {
        const card = e.target.closest('.portfolio-card');
        if(!card) return;
        
        const targetId = parseInt(card.getAttribute('data-id'));
        const matchedItem = items.find(i => i.id === targetId);
        
        if(matchedItem) {
            modalImg.src = matchedItem.image;
            modalBadge.textContent = matchedItem.category;
            modalTitle.textContent = matchedItem.title;
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        }
    });

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    };

    document.getElementById('modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
}

// Scroll Effects
function setupScrollEffects() {
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });
}

// Mobile Responsive Flyout Drawer Navigation
function setupMobileNav() {
    const burger = document.getElementById('hamburger');
    const links = document.getElementById('nav-links');
    
    burger.addEventListener('click', () => {
        links.classList.toggle('active');
        burger.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('active');
            burger.classList.remove('open');
        });
    });
}

// Intersection Observer Optimization Engine for Count-Up Statistics
function setupCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const target = entry.target;
                const endVal = parseInt(target.getAttribute('data-target'));
                let current = 0;
                const duration = 1500;
                const stepTime = Math.max(Math.floor(duration / endVal), 15);
                
                const timer = setInterval(() => {
                    current += Math.ceil(endVal / 60);
                    if (current >= endVal) {
                        target.textContent = endVal + "+";
                        clearInterval(timer);
                    } else {
                        target.textContent = current + "+";
                    }
                }, stepTime);
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    counters.forEach(c => observer.observe(c));
}

// System Startup Initiation
document.addEventListener('DOMContentLoaded', initializeEngine);
