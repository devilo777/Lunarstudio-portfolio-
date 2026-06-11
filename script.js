import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

/* ==========================
   FIREBASE
========================== */

const firebaseConfig = {
    apiKey: "AIzaSyDRQPzKLqaJWPXKELcmXDXNXiEISmM5U6I",
    authDomain: "lunar-studio-portfolios.firebaseapp.com",
    databaseURL: "https://lunar-studio-portfolios-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lunar-studio-portfolios",
    storageBucket: "lunar-studio-portfolios.firebasestorage.app",
    messagingSenderId: "511025066012",
    appId: "1:511025066012:web:6fc28700f3199f4b352fd9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* ==========================
   APP START
========================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeEngine
);

function initializeEngine() {

    loadLogo();

    loadPortfolio();

    loadTeam();

    loadReviews();

    setupScrollEffects();

    setupMobileNav();

    setupCounters();

}

/* ==========================
   LOGO
========================== */

function updateGlobalLogos(
    logoUrl
) {

    const siteLogo =
        document.getElementById(
            "site-logo"
        );

    if(siteLogo){

        siteLogo.src =
            logoUrl;

    }

    document
        .querySelectorAll(
            ".logo-ref"
        )
        .forEach(img => {

            img.src =
                logoUrl;

        });

}

function loadLogo() {

    onValue(
        ref(db,"logo"),
        snapshot => {

            const data =
                snapshot.val();

            if(!data) return;

            updateGlobalLogos(
                data.image
            );

        }
    );

}

/* ==========================
   PORTFOLIO
========================== */

let allPortfolioItems = [];

function loadPortfolio() {

    onValue(
        ref(db,"portfolio"),
        snapshot => {

            const data =
                snapshot.val();

            if(!data){

                renderMainPagePortfolio([]);

                return;

            }

            const items =
                Object.values(
                    data
                );

            allPortfolioItems =
                items;

            renderMainPagePortfolio(
                items
            );

            setupLightbox(
                items
            );

        }
    );

}

function renderMainPagePortfolio(
    items
) {

    const target =
        document.getElementById(
            "portfolio-grid"
        );

    if(!target) return;

    target.innerHTML = "";

    const renderedCategories =
        new Set();

    [...items]
    .reverse()
    .forEach(item => {

        if(
            renderedCategories.has(
                item.category
            )
        ){
            return;
        }

        renderedCategories.add(
            item.category
        );

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "portfolio-card";

        card.setAttribute(
            "data-category",
            item.category
        );

        card.setAttribute(
            "data-id",
            item.id
        );

        card.innerHTML = `
        <div class="portfolio-thumb-wrapper">
            <img
            src="${item.image}"
            alt="${item.title}"
            loading="lazy">
        </div>

        <div class="portfolio-info">

            <span class="badge">
                ${item.category}
            </span>

            <h3>
                ${item.title}
            </h3>

            <a
            href="view-all.html?category=${encodeURIComponent(item.category)}"
            class="view-all-badge-link">

            View All →
            </a>

        </div>
        `;

        target.appendChild(
            card
        );

    });

}

/* ==========================
   TEAM
========================== */

function loadTeam() {

    onValue(
        ref(db,"team"),
        snapshot => {

            const data =
                snapshot.val();

            if(!data){

                renderTeam([]);

                return;

            }

            const items =
                Object.values(
                    data
                );

            renderTeam(
                items
            );

        }
    );

}

function renderTeam(items) {

    const target =
        document.getElementById(
            "team-grid"
        );

    if(!target) return;

    target.innerHTML = "";

    items.forEach(item => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "team-card";

        card.innerHTML = `
        <div class="avatar-wrapper">

            <img
            src="${item.image}"
            alt="${item.name}"
            class="team-avatar">

        </div>

        <h3>
            ${item.name}
        </h3>

        <p>
            ${item.role}
        </p>
        `;

        target.appendChild(
            card
        );

    });

}

/* ==========================
   REVIEWS
========================== */

function loadReviews() {

    onValue(
        ref(db,"reviews"),
        snapshot => {

            const data =
                snapshot.val();

            if(!data){

                renderReviews([]);

                return;

            }

            const items =
                Object.values(
                    data
                );

            renderReviews(
                items
            );

        }
    );

}

function renderReviews(items) {

    const target =
        document.getElementById(
            "reviews-grid"
        );

    if(!target) return;

    target.innerHTML = "";

    items.forEach(item => {

        const stars =
            "★".repeat(
                Number(item.rating)
            ) +
            "☆".repeat(
                5 - Number(item.rating)
            );

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "review-card";

        card.innerHTML = `
        <div class="review-user">

            <img
            src="${item.image}"
            alt="Client"
            class="review-avatar">

            <div class="star-rating">
                ${stars}
            </div>

        </div>

        <p>
            "${item.text}"
        </p>
        `;

        target.appendChild(
            card
        );

    });

}


/* ==========================
   FILTER SYSTEM
========================== */

const filterDropdown =
document.getElementById(
    "portfolio-filter"
);

if(filterDropdown){

    filterDropdown.addEventListener(
        "change",
        (e) => {

            const selection =
                e.target.value;

            const cards =
                document.querySelectorAll(
                    ".portfolio-card"
                );

            cards.forEach(card => {

                if(
                    selection === "All" ||
                    card.getAttribute(
                        "data-category"
                    ) === selection
                ){

                    card.style.display =
                        "block";

                    card.style.opacity =
                        "1";

                }
                else{

                    card.style.opacity =
                        "0";

                    setTimeout(() => {

                        card.style.display =
                            "none";

                    },300);

                }

            });

        }
    );

}

/* ==========================
   LIGHTBOX
========================== */

function setupLightbox(items){

    const modal =
        document.getElementById(
            "portfolio-modal"
        );

    const modalImg =
        document.getElementById(
            "modal-img"
        );

    const modalBadge =
        document.getElementById(
            "modal-badge"
        );

    const modalTitle =
        document.getElementById(
            "modal-title"
        );

    const grid =
        document.getElementById(
            "portfolio-grid"
        );

    if(!grid || !modal) return;

    grid.onclick = (e) => {

        if(
            e.target.closest(
                ".view-all-badge-link"
            )
        ) return;

        const card =
            e.target.closest(
                ".portfolio-card"
            );

        if(!card) return;

        const id =
            card.getAttribute(
                "data-id"
            );

        const item =
            items.find(
                x =>
                String(x.id) ===
                String(id)
            );

        if(!item) return;

        modalImg.src =
            item.image;

        modalBadge.textContent =
            item.category;

        modalTitle.textContent =
            item.title;

        modal.classList.add(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

    };

    const closeBtn =
        document.getElementById(
            "modal-close"
        );

    const closeModal = () => {

        modal.classList.remove(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    };

    if(closeBtn){

        closeBtn.onclick =
            closeModal;

    }

    modal.onclick = (e) => {

        if(
            e.target === modal
        ){

            closeModal();

        }

    };

}

/* ==========================
   SCROLL EFFECTS
========================== */

function setupScrollEffects(){

    const nav =
        document.querySelector(
            ".navbar"
        );

    if(!nav) return;

    window.addEventListener(
        "scroll",
        () => {

            if(
                window.scrollY > 50
            ){

                nav.classList.add(
                    "scrolled"
                );

            }
            else{

                nav.classList.remove(
                    "scrolled"
                );

            }

        }
    );

}

/* ==========================
   MOBILE NAV
========================== */

function setupMobileNav(){

    const burger =
        document.getElementById(
            "hamburger"
        );

    const links =
        document.getElementById(
            "nav-links"
        );

    if(
        !burger ||
        !links
    ) return;

    burger.onclick = () => {

        links.classList.toggle(
            "active"
        );

        burger.classList.toggle(
            "open"
        );

    };

    links
    .querySelectorAll("a")
    .forEach(link => {

        link.onclick = () => {

            links.classList.remove(
                "active"
            );

            burger.classList.remove(
                "open"
            );

        };

    });

}

/* ==========================
   COUNTERS
========================== */

function setupCounters(){

    const counters =
        document.querySelectorAll(
            ".stat-number"
        );

    if(
        counters.length === 0
    ) return;

    const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                if(
                    !entry.isIntersecting
                ) return;

                const target =
                    entry.target;

                const endVal =
                    parseInt(
                        target.dataset.target
                    );

                let current = 0;

                const timer =
                setInterval(() => {

                    current +=
                    Math.ceil(
                        endVal / 60
                    );

                    if(
                        current >= endVal
                    ){

                        target.textContent =
                        endVal + "+";

                        clearInterval(
                            timer
                        );

                    }
                    else{

                        target.textContent =
                        current + "+";

                    }

                },20);

                observer.unobserve(
                    target
                );

            });

        });

    counters.forEach(
        counter =>
        observer.observe(
            counter
        )
    );

}
