import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  set,
  remove,
  onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

console.log("ADMIN JS LOADED SUCCESSFULLY (FREE IMGBB EDITION)");

/* Firebase Settings */
const firebaseConfig = {
  apiKey: "AIzaSyDRQPzKLqaJWPXKELcmXDXNXiEISmM5U6I",
  authDomain: "lunar-studio-portfolios.firebaseapp.com",
  databaseURL: "https://lunar-studio-portfolios-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lunar-studio-portfolios",
  messagingSenderId: "511025066012",
  appId: "1:511025066012:web:6fc28700f3199f4b352fd9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ⚠️ APNI IMGBB API KEY YAHAN Niche " " KE ANDAR PASTE KAREIN
const IMGBB_API_KEY = "a5e316ac0e33850083fd66b16c34039b"; 

/* Session Monitor Initialization */
document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("lunar_admin_auth") === "true") {
    launchDashboardWorkspace();
  } else {
    setupAuthenticationGate();
  }
});

/* Gateway Security Setup */
function setupAuthenticationGate() {
    const form = document.getElementById("auth-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("username").value;
        const pass = document.getElementById("password").value;

        if (user === "D3VIL_" && pass === "D3VIL_") {
            alert("LOGIN SUCCESS");
            sessionStorage.setItem("lunar_admin_auth", "true");
            launchDashboardWorkspace();
        } else {
            alert("LOGIN FAILED");
            document.getElementById("login-error").style.display = "block";
        }
    });
}

/* Dashboard Loader Hook Framework */
function launchDashboardWorkspace() {
  document.getElementById("auth-gate").style.display = "none";
  document.getElementById("dashboard-workspace").style.display = "block";

  // Binding Component Event Callbacks
  document.getElementById("logout-btn").addEventListener("click", executionSecureExitLog);
  document.getElementById("logo-form").addEventListener("submit", uploadLogo);
  document.getElementById("portfolio-form").addEventListener("submit", uploadPortfolioItem);
  document.getElementById("team-form").addEventListener("submit", uploadTeamMember);
  document.getElementById("reviews-form").addEventListener("submit", uploadReview);
  
  const catForm = document.getElementById("category-form");
  if (catForm) {
      catForm.addEventListener("submit", uploadCategoryItem);
  }

  // Active Streams Initializers
  loadLogo();
  loadCategories();
  loadPortfolio();
  loadTeam();
  loadReviews();
  enableBackupSystem();
}

function executionSecureExitLog() {
  sessionStorage.removeItem("lunar_admin_auth");
  location.reload();
}

/* 100% Free Image Upload Logic Using Imgbb API */
async function uploadImage(file) {
  if (IMGBB_API_KEY === "YAHAN_APNI_IMGBB_API_KEY_DALO" || !IMGBB_API_KEY) {
    alert("Bhai, pehle admin.js me line number 22 par apni Imgbb API Key dalo!");
    throw new Error("Missing Imgbb API Key");
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      // Yeh hume direct image ka URL nikal kar dega
      return result.data.url; 
    } else {
      throw new Error(result.error.message || "Upload failed");
    }
  } catch (error) {
    console.error("Imgbb Upload Error:", error);
    alert("Image upload fail ho gaya! Console check karein.");
    throw error;
  }
}

/* =====================================
   LOGO COMPONENT MODULES
===================================== */
async function uploadLogo(e) {
    e.preventDefault();
    const file = document.getElementById("logo-path").files[0];
    if (!file) return;

    try {
        const imageUrl = await uploadImage(file);
        await set(ref(db, "logo"), { image: imageUrl });
        
        const preview = document.getElementById("admin-logo-preview");
        if (preview) preview.src = imageUrl;

        alert("Logo Updated Successfully (via Imgbb)");
        document.getElementById("logo-form").reset();
    } catch (err) {
        console.error(err);
    }
}

function loadLogo() {
    onValue(ref(db, "logo"), (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        const preview = document.getElementById("admin-logo-preview");
        if (preview) preview.src = data.image;
    });
}

/* =====================================
   CATEGORY COMPONENT MODULES
===================================== */
async function uploadCategoryItem(e) {
    e.preventDefault();
    const nameField = document.getElementById("c-name");
    if (!nameField || !nameField.value.trim()) return;

    try {
        const catRef = push(ref(db, "categories"));
        await set(catRef, {
            id: catRef.key,
            name: nameField.value.trim()
        });
        document.getElementById("category-form").reset();
        alert("Category Added Successfully");
    } catch (err) {
        console.error(err);
        alert("Category Addition Failed");
    }
}

function loadCategories() {
    const table = document.getElementById("category-table-body");
    const selectDropdown = document.getElementById("p-category");
    if (!table) return;

    onValue(ref(db, "categories"), (snapshot) => {
        table.innerHTML = "";
        if (selectDropdown) selectDropdown.innerHTML = "";
        const data = snapshot.val();
        if (!data) return;

        Object.entries(data).forEach(([id, item]) => {
            table.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>
                    <button onclick="deleteCategory('${id}')" class="admin-btn admin-btn-danger">Delete</button>
                </td>
            </tr>`;
            
            if (selectDropdown) {
                selectDropdown.innerHTML += `<option value="${item.name}">${item.name}</option>`;
            }
        });
    });
}

window.deleteCategory = async function(id) {
    if (!confirm("Delete Category?")) return;
    await remove(ref(db, "categories/" + id));
};

/* =====================================
   PORTFOLIO CATALOG MODULES
===================================== */
async function uploadPortfolioItem(e) {
    e.preventDefault();
    const title = document.getElementById("p-title").value;
    const category = document.getElementById("p-category").value;
    const isCover = document.getElementById("p-is-cover").checked;
    const file = document.getElementById("p-image").files[0];
    if (!file) return;

    try {
        const imageUrl = await uploadImage(file);
        const portfolioRef = push(ref(db, "portfolio"));

        await set(portfolioRef, {
            id: portfolioRef.key,
            title,
            category,
            isCover,
            image: imageUrl
        });

        document.getElementById("portfolio-form").reset();
        alert("Portfolio Asset Deployed Successfully");
    } catch (err) {
        console.error(err);
    }
}

function loadPortfolio() {
    const table = document.getElementById("portfolio-table-body");
    if (!table) return;

    onValue(ref(db, "portfolio"), (snapshot) => {
        table.innerHTML = "";
        const data = snapshot.val();
        if (!data) return;

        Object.entries(data).forEach(([id, item]) => {
            table.innerHTML += `
            <tr>
                <td><img src="${item.image}" width="80" style="object-fit:cover; border-radius:4px;"></td>
                <td>${item.title}</td>
                <td>${item.category}</td>
                <td>${item.isCover ? "Main Page Cover" : "Standard Card"}</td>
                <td>
                    <button onclick="deletePortfolio('${id}')" class="admin-btn admin-btn-danger">Delete</button>
                </td>
            </tr>`;
        });
    });
}

window.deletePortfolio = async function(id) {
    if (!confirm("Delete Portfolio Asset?")) return;
    await remove(ref(db, "portfolio/" + id));
};

/* =====================================
   TEAM MANAGEMENT MODULES
===================================== */
async function uploadTeamMember(e) {
    e.preventDefault();
    const name = document.getElementById("t-name").value;
    const role = document.getElementById("t-role").value;
    const file = document.getElementById("t-image").files[0];
    if (!file) return;

    try {
        const imageUrl = await uploadImage(file);
        const teamRef = push(ref(db, "team"));

        await set(teamRef, {
            id: teamRef.key,
            name,
            role,
            image: imageUrl
        });

        document.getElementById("team-form").reset();
        alert("Team Member Added");
    } catch (err) {
        console.error(err);
    }
}

function loadTeam() {
    const table = document.getElementById("team-table-body");
    if (!table) return;

    onValue(ref(db, "team"), (snapshot) => {
        table.innerHTML = "";
        const data = snapshot.val();
        if (!data) return;

        Object.entries(data).forEach(([id, item]) => {
            table.innerHTML += `
            <tr>
                <td><img src="${item.image}" width="70" style="border-radius:50%; object-fit:cover;"></td>
                <td>${item.name}</td>
                <td>${item.role}</td>
                <td>
                    <button onclick="deleteTeam('${id}')" class="admin-btn admin-btn-danger">Delete</button>
                </td>
            </tr>`;
        });
    });
}

window.deleteTeam = async function(id) {
    if (!confirm("Delete Team Member?")) return;
    await remove(ref(db, "team/" + id));
};

/* =====================================
   REVIEWS GRID MODULES
===================================== */
async function uploadReview(e) {
    e.preventDefault();
    const rating = document.getElementById("r-rating").value;
    const text = document.getElementById("r-text").value;
    const file = document.getElementById("r-image").files[0];
    if (!file) return;

    try {
        const imageUrl = await uploadImage(file);
        const reviewRef = push(ref(db, "reviews"));

        await set(reviewRef, {
            id: reviewRef.key,
            image: imageUrl,
            rating,
            text
        });

        document.getElementById("reviews-form").reset();
        alert("Review Published");
    } catch (err) {
        console.error(err);
    }
}

function loadReviews() {
    const table = document.getElementById("reviews-table-body");
    if (!table) return;

    onValue(ref(db, "reviews"), (snapshot) => {
        table.innerHTML = "";
        const data = snapshot.val();
        if (!data) return;

        Object.entries(data).forEach(([id, item]) => {
            table.innerHTML += `
            <tr>
                <td><img src="${item.image}" width="70" style="border-radius:50%; object-fit:cover;"></td>
                <td>${item.text}</td>
                <td>${item.rating} Stars Matrix</td>
                <td>
                    <button onclick="deleteReview('${id}')" class="admin-btn admin-btn-danger">Delete</button>
                </td>
            </tr>`;
        });
    });
}

window.deleteReview = async function(id) {
    if (!confirm("Delete Review Data Node?")) return;
    await remove(ref(db, "reviews/" + id));
};

/* =====================================
   BACKUP RECOVERY EXPORT COMPONENT
===================================== */
function enableBackupSystem() {
    const backupBtn = document.getElementById("backup-btn");
    if (!backupBtn) return;

    backupBtn.addEventListener("click", async () => {
        try {
            const backupData = {};
            const sections = ["logo", "categories", "portfolio", "team", "reviews"];

            for (const section of sections) {
                await new Promise(resolve => {
                    onValue(ref(db, section), snapshot => {
                        backupData[section] = snapshot.val();
                        resolve();
                    }, { onlyOnce: true });
                });
            }

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "lunar-backup.json";
            link.click();
        } catch (err) {
            console.error(err);
            alert("Backup Processing Failed");
        }
    });
}
