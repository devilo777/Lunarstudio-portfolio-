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
    document.getElementById('portfolio-form').addEventListener('submit', appendPortfolioItem);
    document.getElementById('team-form').addEventListener('submit', appendTeamMember);
    document.getElementById('reviews-form').addEventListener('submit', appendReviewCard);
    
    refreshDashboardUIModules();
}

// Global Core Structural Synchronization Engine Mapping Pull Actions
function refreshDashboardUIModules() {
    const db = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!db) return; // Fail-Safe Guard Route
    
    // Refresh Dynamic Modules Data Arrays Displays
    document.getElementById('logo-path').value = db.logo;
    document.getElementById('admin-logo-preview').src = db.logo;
    
    buildPortfolioTableRows(db.portfolio);
    buildTeamTableRows(db.team);
    buildReviewsTableRows(db.reviews);
}

// Table Grid Dynamic Structural Build Handlers
function buildPortfolioTableRows(items) {
    const tbody = document.getElementById('portfolio-table-body');
    tbody.innerHTML = '';
    
    // Render pool collection mapping loop tracking
    items.forEach(item => {
        const tr = document.createElement('tr');
        
        // Define clean custom UI badge tracking for covers
        const displayTypeTag = item.isCover 
            ? `<span class="badge" style="background:rgba(16,185,129,0.15); color:#34d399; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600;">★ Main Face Cover</span>` 
            : `<span class="badge" style="background:rgba(255,255,255,0.05); color:#94a3b8; padding:4px 8px; border-radius:4px; font-size:0.75rem;">View All Asset</span>`;

        tr.innerHTML = `
            <td><img src="${item.image}" class="tbl-img-preview" alt="Asset Asset Preview Item Row Frame"></td>
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
    tbody.innerHTML = '';
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.image}" class="tbl-avatar-preview" alt="Operator Account Roster Portrait View Avatar"></td>
            <td><span class="bold-title">${item.name}</span></td>
            <td><span class="sub-meta">${item.role}</span></td>
            <td><button class="admin-btn admin-btn-danger" onclick="deleteRecordNode('team', ${item.id})">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function buildReviewsTableRows(items) {
    const tbody = document.getElementById('reviews-table-body');
    tbody.innerHTML = '';
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.clientImage}" class="tbl-avatar-preview" alt="Verification Client Avatar Node Tracking Graphic"></td>
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

function appendPortfolioItem(e) {
    e.preventDefault();
    const title = document.getElementById('p-title').value;
    const category = document.getElementById('p-category').value;
    const image = document.getElementById('p-image').value;
    const isCover = document.getElementById('p-is-cover').checked;
    
    mutateDatabase(db => {
        // Safe check initialization array validation routing
        if(!db.portfolio) db.portfolio = [];

        // CRITICAL SYNC LOGIC: Agar naya thumbnail as a Cover set ho raha hai,
        // toh is specific category ke baaki saare purane thumbnails ko false (uncheck) kardo
        if (isCover) {
            db.portfolio.forEach(item => {
                if(item.category === category) {
                    item.isCover = false;
                }
            });
        }

        // Push clean complete model mapping array item object structure
        db.portfolio.push({ 
            id: Date.now(), 
            title, 
            category, 
            image, 
            isCover: isCover 
        });
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
    
    // Garbage Clean Collection Lifecycle Execution Routine
    document.body.removeChild(virtualLinkAnchor);
    URL.revokeObjectURL(allocationUrl);
}

// Secure Interface Logs Session Exiter
function executionSecureExitLog() {
    sessionStorage.removeItem('lunar_admin_auth');
    window.location.reload();
        }
