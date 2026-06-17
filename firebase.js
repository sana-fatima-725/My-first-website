// =============================================
// firebase.js — Ahsan Mobiles.pk
// Include this in ALL pages via:
// <script type="module" src="firebase.js"></script>
// =============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ── Your Firebase Config ──
const firebaseConfig = {
  apiKey: "AIzaSyBYw7O8vjPGUc8MzfjUiMCNgCnxh-fQDbs",
  authDomain: "ahsan-mobiles.firebaseapp.com",
  projectId: "ahsan-mobiles",
  storageBucket: "ahsan-mobiles.firebasestorage.app",
  messagingSenderId: "527845362077",
  appId: "1:527845362077:web:aa19595d090c08f648c774"
};

// ── Initialize ──
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const storage = getStorage(app);

// ── Admin email (only this email gets admin access) ──
const ADMIN_EMAIL = "your-admin-email@gmail.com"; // <-- apni admin email yahan likho

export { app, auth, db, storage, ADMIN_EMAIL };