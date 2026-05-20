// ============================================
// AHSAN MOBILES - Firebase Configuration
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBYw7O8vjPGUc8MzfjUiMCNgCnxh-fQDbs",
  authDomain: "ahsan-mobiles.firebaseapp.com",
  projectId: "ahsan-mobiles",
  storageBucket: "ahsan-mobiles.firebasestorage.app",
  messagingSenderId: "527845362077",
  appId: "1:527845362077:web:aa19595d090c08f648c774"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ============================================
// LOGIN FUNCTION
// ============================================
window.adminLogin = async function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'admin.html'; // Admin dashboard pe bhejo
  } catch (error) {
    errorMsg.textContent = "❌ Galat email ya password!";
    errorMsg.style.color = "red";
  }
}

// ============================================
// LOGOUT FUNCTION
// ============================================
window.adminLogout = async function() {
  await signOut(auth);
  window.location.href = 'login.html';
}

// ============================================
// CHECK LOGIN STATUS
// ============================================
window.checkAuth = function(redirectIfNotLoggedIn = true) {
  onAuthStateChanged(auth, (user) => {
    if (!user && redirectIfNotLoggedIn) {
      window.location.href = 'login.html';
    }
  });
}

// ============================================
// PRODUCTS - ADD
// ============================================
window.addProduct = async function(productData) {
  try {
    await addDoc(collection(db, "products"), {
      ...productData,
      timestamp: new Date()
    });
    alert("✅ Product add ho gaya!");
  } catch (error) {
    alert("❌ Error: " + error.message);
  }
}

// ============================================
// PRODUCTS - GET ALL
// ============================================
window.getProducts = async function() {
  const querySnapshot = await getDocs(collection(db, "products"));
  const products = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() });
  });
  return products;
}

// ============================================
// PRODUCTS - DELETE
// ============================================
window.deleteProduct = async function(productId) {
  await deleteDoc(doc(db, "products", productId));
  alert("🗑️ Product delete ho gaya!");
}

// ============================================
// CONTACT FORM - SAVE
// ============================================
window.saveContact = async function(formData) {
  try {
    await addDoc(collection(db, "contacts"), {
      ...formData,
      timestamp: new Date()
    });
    alert("✅ Message bhej diya gaya!");
  } catch (error) {
    alert("❌ Error: " + error.message);
  }
}

export { auth, db };