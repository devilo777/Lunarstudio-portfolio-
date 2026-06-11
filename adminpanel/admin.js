import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  set,
  remove,
  onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

console.log("ADMIN JS LOADED");
alert("ADMIN JS LOADED");
/* Firebase Config */

const firebaseConfig = {
  apiKey: "AIzaSyDRQPzKLqaJWPXKELcmXDXNXiEISmM5U6I",
  authDomain: "lunar-studio-portfolios.firebaseapp.com",
  databaseURL:
    "https://lunar-studio-portfolios-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lunar-studio-portfolios",
  storageBucket: "lunar-studio-portfolios.firebasestorage.app",
  messagingSenderId: "511025066012",
  appId: "1:511025066012:web:6fc28700f3199f4b352fd9"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const storage = getStorage(app);

/* Startup */

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("lunar_admin_auth") === "true") {
    launchDashboardWorkspace();
  } else {
    setupAuthenticationGate();
  }
});

/* Login */

function setupAuthenticationGate() {

    alert("STEP 1");

    const form = document.getElementById("auth-form");

    form.addEventListener("submit", (e) => {

        alert("STEP 2");

        e.preventDefault();

        const user =
            document.getElementById("username").value;

        const pass =
            document.getElementById("password").value;

        alert(
            "USER = " + user +
            "\nPASS = " + pass
        );

        if (user === "D3VIL_" && pass === "D3VIL_") {

  alert("LOGIN SUCCESS");

  sessionStorage.setItem(
    "lunar_admin_auth",
    "true"
  );

  launchDashboardWorkspace();

} else {

  alert("LOGIN FAILED");

  document.getElementById(
    "login-error"
  ).style.display = "block";

        }

          
    });

}

function launchDashboardWorkspace() {
  document.getElementById(
    "auth-gate"
  ).style.display = "none";

  document.getElementById(
    "dashboard-workspace"
  ).style.display = "block";

  document
    .getElementById("logout-btn")
    .addEventListener(
      "click",
      executionSecureExitLog
    );

  document
    .getElementById("logo-form")
    .addEventListener(
      "submit",
      uploadLogo
    );

  document
    .getElementById("portfolio-form")
    .addEventListener(
      "submit",
      uploadPortfolioItem
    );

  document
    .getElementById("team-form")
    .addEventListener(
      "submit",
      uploadTeamMember
    );

  document
    .getElementById("reviews-form")
    .addEventListener(
      "submit",
      uploadReview
    );

  loadLogo();
  loadPortfolio();
  loadTeam();
  loadReviews();
  enableBackupSystem();
}

function executionSecureExitLog() {
  sessionStorage.removeItem(
    "lunar_admin_auth"
  );

  location.reload();
  
}

async function uploadImage(file, folder) {

  const fileName =
    Date.now() + "_" + file.name;

  const fileRef = storageRef(
    storage,
    `${folder}/${fileName}`
  );

  await uploadBytes(
    fileRef,
    file
  );

  const url =
    await getDownloadURL(fileRef);

  return url;
}

/* =====================================
   LOGO UPLOAD
===================================== */

async function uploadLogo(e) {

    e.preventDefault();

    const file =
        document.getElementById("logo-path")
        .files[0];

    if (!file) return;

    try {

        const imageUrl =
            await uploadImage(
                file,
                "logo"
            );

        await set(
            ref(db, "logo"),
            {
                image: imageUrl
            }
        );

        alert(
            "Logo Updated Successfully"
        );

    } catch (err) {

        console.error(err);

        alert(
            "Logo Upload Failed"
        );

    }

}

function loadLogo() {

    const logoRef =
        ref(db, "logo");

    onValue(
        logoRef,
        (snapshot) => {

            const data =
                snapshot.val();

            if (!data) return;

            const preview =
                document.getElementById(
                    "admin-logo-preview"
                );

            preview.src =
                data.image;

        }
    );

}

/* =====================================
   PORTFOLIO UPLOAD
===================================== */

async function uploadPortfolioItem(e) {

    e.preventDefault();

    const title =
        document.getElementById(
            "p-title"
        ).value;

    const category =
        document.getElementById(
            "p-category"
        ).value;

    const file =
        document.getElementById(
            "p-image"
        ).files[0];

    if (!file) return;

    try {

        const imageUrl =
            await uploadImage(
                file,
                "portfolio"
            );

        const portfolioRef =
            push(
                ref(
                    db,
                    "portfolio"
                )
            );

        await set(
            portfolioRef,
            {
                id:
                    portfolioRef.key,
                title,
                category,
                image:
                    imageUrl
            }
        );

        document
            .getElementById(
                "portfolio-form"
            )
            .reset();

        alert(
            "Portfolio Added"
        );

    } catch (err) {

        console.error(err);

        alert(
            "Portfolio Upload Failed"
        );

    }

}

/* =====================================
   TEAM MEMBER UPLOAD
===================================== */

async function uploadTeamMember(e) {

    e.preventDefault();

    const name =
        document.getElementById(
            "t-name"
        ).value;

    const role =
        document.getElementById(
            "t-role"
        ).value;

    const file =
        document.getElementById(
            "t-image"
        ).files[0];

    if (!file) return;

    try {

        const imageUrl =
            await uploadImage(
                file,
                "team"
            );

        const teamRef =
            push(
                ref(
                    db,
                    "team"
                )
            );

        await set(
            teamRef,
            {
                id:
                    teamRef.key,
                name,
                role,
                image:
                    imageUrl
            }
        );

        document
            .getElementById(
                "team-form"
            )
            .reset();

        alert(
            "Team Member Added"
        );

    } catch (err) {

        console.error(err);

        alert(
            "Team Upload Failed"
        );

    }

}

/* =====================================
   REVIEW UPLOAD
===================================== */

async function uploadReview(e) {

    e.preventDefault();

    const rating =
        document.getElementById(
            "r-rating"
        ).value;

    const text =
        document.getElementById(
            "r-text"
        ).value;

    const file =
        document.getElementById(
            "r-image"
        ).files[0];

    if (!file) return;

    try {

        const imageUrl =
            await uploadImage(
                file,
                "reviews"
            );

        const reviewRef =
            push(
                ref(
                    db,
                    "reviews"
                )
            );

        await set(
            reviewRef,
            {
                id:
                    reviewRef.key,
                image:
                    imageUrl,
                rating,
                text
            }
        );

        document
            .getElementById(
                "reviews-form"
            )
            .reset();

        alert(
            "Review Published"
        );

    } catch (err) {

        console.error(err);

        alert(
            "Review Upload Failed"
        );

    }

}
function loadPortfolio() {

    const table =
        document.getElementById(
            "portfolio-table-body"
        );

    onValue(
        ref(db, "portfolio"),
        (snapshot) => {

            table.innerHTML = "";

            const data =
                snapshot.val();

            if (!data) return;

            Object.entries(data)
            .forEach(([id,item]) => {

                table.innerHTML += `
                <tr>
                    <td>
                        <img
                        src="${item.image}"
                        width="80">
                    </td>

                    <td>
                        ${item.title}
                    </td>

                    <td>
                        ${item.category}
                    </td>

                    <td>
                        <button
                        onclick="deletePortfolio('${id}')"
                        class="admin-btn admin-btn-danger">
                        Delete
                        </button>
                    </td>
                </tr>
                `;

            });

        }
    );

}

function loadTeam() {

    const table =
        document.getElementById(
            "team-table-body"
        );

    onValue(
        ref(db, "team"),
        (snapshot) => {

            table.innerHTML = "";

            const data =
                snapshot.val();

            if (!data) return;

            Object.entries(data)
            .forEach(([id,item]) => {

                table.innerHTML += `
                <tr>

                    <td>
                        <img
                        src="${item.image}"
                        width="70">
                    </td>

                    <td>
                        ${item.name}
                    </td>

                    <td>
                        ${item.role}
                    </td>

                    <td>

                        <button
                        onclick="deleteTeam('${id}')"
                        class="admin-btn admin-btn-danger">

                        Delete

                        </button>

                    </td>

                </tr>
                `;

            });

        }
    );

}

function loadReviews() {

    const table =
        document.getElementById(
            "reviews-table-body"
        );

    onValue(
        ref(db, "reviews"),
        (snapshot) => {

            table.innerHTML = "";

            const data =
                snapshot.val();

            if (!data) return;

            Object.entries(data)
            .forEach(([id,item]) => {

                table.innerHTML += `
                <tr>

                    <td>
                        <img
                        src="${item.image}"
                        width="70">
                    </td>

                    <td>
                        ${item.text}
                    </td>

                    <td>
                        ${item.rating}
                    </td>

                    <td>

                        <button
                        onclick="deleteReview('${id}')"
                        class="admin-btn admin-btn-danger">

                        Delete

                        </button>

                    </td>

                </tr>
                `;

            });

        }
    );

}

window.deletePortfolio =
async function(id) {

    if(
        !confirm(
            "Delete Portfolio?"
        )
    ) return;

    await remove(
        ref(
            db,
            "portfolio/" + id
        )
    );

};

window.deleteTeam =
async function(id) {

    if(
        !confirm(
            "Delete Team Member?"
        )
    ) return;

    await remove(
        ref(
            db,
            "team/" + id
        )
    );

};

window.deleteReview =
async function(id) {

    if(
        !confirm(
            "Delete Review?"
        )
    ) return;

    await remove(
        ref(
            db,
            "reviews/" + id
        )
    );

};

function enableBackupSystem() {

    const backupBtn =
        document.getElementById(
            "backup-btn"
        );

    backupBtn.addEventListener(
        "click",
        async () => {

            try {

                const backupData = {};

                const sections = [
                    "logo",
                    "portfolio",
                    "team",
                    "reviews"
                ];

                for (const section of sections) {

                    await new Promise(
                        resolve => {

                            onValue(
                                ref(db, section),
                                snapshot => {

                                    backupData[
                                        section
                                    ] =
                                    snapshot.val();

                                    resolve();

                                },
                                {
                                    onlyOnce:true
                                }
                            );

                        }
                    );

                }

                const blob =
                    new Blob(
                        [
                            JSON.stringify(
                                backupData,
                                null,
                                2
                            )
                        ],
                        {
                            type:
                            "application/json"
                        }
                    );

                const link =
                    document.createElement(
                        "a"
                    );

                link.href =
                    URL.createObjectURL(
                        blob
                    );

                link.download =
                    "lunar-backup.json";

                link.click();

            }
            catch(err){

                console.error(err);

                alert(
                    "Backup Failed"
                );

            }

        }
    );

}
