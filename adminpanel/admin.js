// Local Configuration Database Tracking Drivers
const STORAGE_KEY = 'lunar_studio_db';

// Primary Core Initialization Routing Protection Entry Check
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('lunar_admin_auth') === 'true') {
        launchDashboardWorkspace();
    } else {
        setupAuthenticationGate();
    }
});

// Authentication System Intercept Processor
function setupAuthenticationGate() {
    const form = document.getElementById('auth-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        
        if (user === 'D3VIL_' && pass === 'D3VIL_') {
            sessionStorage.setItem('lunar_admin_auth', 'true');
            document.getElementById('login-error').style.display = 'none';
            launchDashboardWorkspace();
        } else {
            document.getElementById('login-error').style.display = 'block';
            form.reset();
        }
    });
}

// Main Core Operational View Transition Handler State Launcher
function launchDashboardWorkspace() {
    document.getElementById('auth-gate').style.display = 'none';
    document.getElementById('dashboard-workspace').style.display = 'block';
    
    // Core Event Handlers Setup Integration Binding Matrix
    document.getElementById('logout-btn').addEventListener('click', executionSecureExitLog);
    document.getElementById('backup-btn').addEventListener('click', runSystemBackupRoutine);
    
    // Connect Form Action Event Submit Targets
    document.getElementById('logo-form').addEventListener('submit', commitLogoUpdate);
    document.getElementById('category-form').addEventListener('submit', appendCategoryNode); // Category form link
    document.getElementById('portfolio-form').addEventListener('submit', appendPortfolioItem);
    document.getElementById('team-form').addEventListener('submit', appendTeamMember);
    document.getElementById('reviews-form').addEventListener('submit', appendReviewCard);
    
    refreshDashboardUIModules();
}

// Global Core Structural Synchronization Engine Mapping Pull Actions
function refreshDashboardUIModules() {
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!db) return; // Fail-Safe Guard Route
    
    // Base Check to ensure default categories schema exist inside storage framework
    if (!db.categories) {
        db.categories = ["Gaming", "IRL", "Esports", "Posters", "Branding"];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
    
    // Refresh Dynamic Modules Data Arrays Displays
    document.getElementById('logo-path').value = db.logo;
    document.getElementById('admin-logo-preview').src = db.logo;
    
    buildCategoryDropdownAndTable(db.categories);
    buildPortfolioTableRows(db.portfolio);
    buildTeamTableRows(db.team);
    buildReviewsTableRows(db.reviews);
}

// Category Specific UI Synchronization Dropdowns Framework builder
function buildCategoryDropdownAndTable(categoriesList) {
    const dropdown = document.getElementById('p-category');
    const tbody = document.getElementById('category-table-body');
    
    if(dropdown) {
        dropdown.innerHTML = '';
        categoriesList.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            dropdown.appendChild(opt);
        });
    }
    
    if(tbody) {
        tbody.innerHTML = '';
        categoriesList.forEach((cat, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="bold-title">${cat}</span></td>
                <td><button class="admin-btn admin-btn-danger" onclick="deleteCategoryNode('${cat}')">Delete Category</button></td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Table Grid Dynamic Structural Build Handlers
function buildPortfolioTableRows(items) {
    const tbody = document.getElementById('portfolio-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    
    items.forEach(item => {
        const tr = document.createElement('tr');
        const displayTypeTag = item.isCover 
            ? `<span class="badge" style="background:rgba(16,185,129,0.15); color:#34d399; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600;">★ Main Face Cover</span>` 
            : `<span class="badge" style="background:rgba(255,255,255,0.05); color:#94a3b8; padding:4px 8px; border-radius:4px; font-size:0.75rem;">View All Asset</span>`;

        tr.innerHTML = `
            <td><img src="${item.image}" class="tbl-img-preview" alt="Asset Preview"></td>
            <td><span class="bold-title">${item.title}</span><span class="sub-meta">${item.image.substring(0, 45)}...</span></td>
            <td><span class="badge" style="background:rgba(139,92,246,0.15); color:#a78bfa; padding:4px 8px; border-radius:4px; font-size:0.75rem;">${item.category}</span></td>
            <td>${displayTypeTag}</td>
            <td><button class="admin-btn admin-btn-danger" onclick="deleteRecordNode('portfolio', ${item.id})">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function buildTeamTableRows(items) {
    const tbody = document.getElementById('team-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.image}" class="tbl-avatar-preview" alt="Avatar"></td>
            <td><span class="bold-title">${item.name}</span></td>
            <td><span class="sub-meta">${item.role}</span></td>
            <td><button class="admin-btn admin-btn-danger" onclick="deleteRecordNode('team', ${item.id})">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function buildReviewsTableRows(items) {
    const tbody = document.getElementById('reviews-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.clientImage}" class="tbl-avatar-preview" alt="Client Avatar"></td>
            <td><span class="sub-meta" style="display:block; max-width:400px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">"${item.text}"</span></td>
            <td><span style="color:#f59e0b; font-weight:600;">${'★'.repeat(item.rating)}</span></td>
            <td><button class="admin-btn admin-btn-danger" onclick="deleteRecordNode('reviews', ${item.id})">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Form Submission Database Transaction Modifiers Commit Methods
function commitLogoUpdate(e) {
    e.preventDefault();
    const path = document.getElementById('logo-path').value;
    mutateDatabase(db => { db.logo = path; });
}

function appendCategoryNode(e) {
    e.preventDefault();
    const catName = document.getElementById('c-name').value.trim();
    if(!catName) return;
    
    mutateDatabase(db => {
        if(!db.categories) db.categories = [];
        // Prevent duplicate category additions profiles
        if(!db.categories.includes(catName)){
            db.categories.push(catName);
        } else {
            alert('Category already exists inside engine database registry.');
        }
    });
    document.getElementById('category-form').reset();
}

function appendPortfolioItem(e) {
    e.preventDefault();
    const title = document.getElementById('p-title').value;
    const category = document.getElementById('p-category').value;
    const image = document.getElementById('p-image').value;
    const isCover = document.getElementById('p-is-cover').checked;
    
    mutateDatabase(db => {
        if(!db.portfolio) db.portfolio = [];

        if (isCover) {
            db.portfolio.forEach(item => {
                if(item.category === category) {
                    item.isCover = false;
                }
            });
        }

        db.portfolio.push({ id: Date.now(), title, category, image, isCover });
    });
    document.getElementById('portfolio-form').reset();
}

function appendTeamMember(e) {
    e.preventDefault();
    const name = document.getElementById('t-name').value;
    const role = document.getElementById('t-role').value;
    const image = document.getElementById('t-image').value;
    
    mutateDatabase(db => {
        db.team.push({ id: Date.now(), name, role, image });
    });
    document.getElementById('team-form').reset();
}

function appendReviewCard(e) {
    e.preventDefault();
    const clientImage = document.getElementById('r-image').value;
    const rating = parseInt(document.getElementById('r-rating').value);
    const text = document.getElementById('r-text').value;
    
    mutateDatabase(db => {
        db.reviews.push({ id: Date.now(), clientImage, rating, text });
    });
    document.getElementById('reviews-form').reset();
}

// Dedicated Category Deletion Window Callback Module
window.deleteCategoryNode = function(categoryName) {
    if(confirm(`Are you sure you want to delete "${categoryName}" category? Warning: This will not delete project assets matching this tag but they wont show up on structured grids.`)) {
        mutateDatabase(db => {
            db.categories = db.categories.filter(c => c !== categoryName);
        });
    }
};

// Global Scope Node Record Array Extractor Element Mutation Eraser Link Function
window.deleteRecordNode = function(moduleTarget, idKey) {
    if(confirm('Are you absolutely sure you want to delete this record? This action cannot be undone.')) {
        mutateDatabase(db => {
            db[moduleTarget] = db[moduleTarget].filter(record => record.id !== idKey);
        });
    }
};

// Internal Atomic Safe-State LocalStorage Modifier Engine Function
function mutateDatabase(mutationCallback) {
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY));
    mutationCallback(db);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    refreshDashboardUIModules();
}

// System Export Backup Utility File Data Generator Downloader Module Function
function runSystemBackupRoutine() {
    const rawDataStr = localStorage.getItem(STORAGE_KEY);
    const blobPayload = new Blob([rawDataStr], { type: 'application/json' });
    const allocationUrl = URL.createObjectURL(blobPayload);
    
    const virtualLinkAnchor = document.createElement('a');
    virtualLinkAnchor.href = allocationUrl;
    virtualLinkAnchor.download = `lunar_studio_backup.json`;
    document.body.appendChild(virtualLinkAnchor);
    virtualLinkAnchor.click();
    
    document.body.removeChild(virtualLinkAnchor);
    URL.revokeObjectURL(allocationUrl);
}

// Secure Interface Logs Session Exiter
function executionSecureExitLog() {
    sessionStorage.removeItem('lunar_admin_auth');
    window.location.reload();
}
