// =============================================
// nav-auth.js — Ahsan Mobiles.pk
// Is file ko har HTML page mein add karo:
// <script type="module" src="nav-auth.js"></script>
// =============================================

import { initializeApp }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut }
                           from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYw7O8vjPGUc8MzfjUiMCNgCnxh-fQDbs",
  authDomain: "ahsan-mobiles.firebaseapp.com",
  projectId: "ahsan-mobiles",
  storageBucket: "ahsan-mobiles.firebasestorage.app",
  messagingSenderId: "527845362077",
  appId: "1:527845362077:web:aa19595d090c08f648c774"
};

const ADMIN_EMAIL = "sana180fatima@gmail.com";
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Cart badge update
function updateCartBadge() {
  const cart  = JSON.parse(localStorage.getItem('am_cart') || '[]');
  const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
  document.querySelectorAll('.cart-count-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

// Build user dropdown HTML
function buildUserDropdown(user) {
  const initial = (user.displayName || user.email || 'U')[0].toUpperCase();
  const name    = user.displayName || user.email.split('@')[0];
  return `
    <div class="am-user-wrap" id="am-user-wrap">
      <div class="am-user-btn" onclick="document.getElementById('am-user-wrap').classList.toggle('open')">
        <div class="am-avatar">${initial}</div>
        <span class="am-uname">${name}</span>
        <span class="am-arrow">▾</span>
      </div>
      <div class="am-dropdown">
        <a href="user-dashboard.html" class="am-dd-item">👤 My Profile</a>
        <a href="user-dashboard.html?tab=orders" class="am-dd-item">📦 My Orders</a>
        <a href="cart.html" class="am-dd-item">🛒 My Cart</a>
        <div class="am-dd-divider"></div>
        <div class="am-dd-item am-logout" onclick="window.__amLogout()">🚪 Logout</div>
      </div>
    </div>`;
}

// CSS for user dropdown
const style = document.createElement('style');
style.textContent = `
.am-user-wrap{position:relative;display:inline-flex;align-items:center;}
.am-user-btn{display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 12px;border-radius:10px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);transition:all .2s;}
.am-user-btn:hover{background:rgba(0,212,255,0.15);}
.am-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#00d4ff,#7c3aed);color:#000;font-weight:800;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.am-uname{font-size:13px;font-weight:600;color:#f0f0ff;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.am-arrow{font-size:10px;color:rgba(255,255,255,0.45);transition:transform .2s;}
.am-user-wrap.open .am-arrow{transform:rotate(180deg);}
.am-dropdown{display:none;position:absolute;top:calc(100% + 8px);right:0;background:#0f0f1e;border:1.5px solid rgba(0,212,255,0.2);border-radius:14px;padding:6px;min-width:180px;z-index:9999;box-shadow:0 16px 48px rgba(0,0,0,0.5);}
.am-user-wrap.open .am-dropdown{display:block;animation:amDrop .2s ease;}
@keyframes amDrop{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
.am-dd-item{display:flex;align-items:center;gap:9px;padding:10px 13px;border-radius:9px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.65);cursor:pointer;transition:.15s;text-decoration:none;}
.am-dd-item:hover{background:rgba(0,212,255,0.08);color:#f0f0ff;}
.am-dd-divider{height:1px;background:rgba(255,255,255,0.07);margin:4px 0;}
.am-logout{color:rgba(239,68,68,0.8)!important;}
.am-logout:hover{background:rgba(239,68,68,0.08)!important;}
.cart-count-badge{position:absolute;top:-6px;right:-8px;background:#00d4ff;color:#000;font-size:9px;font-weight:800;width:17px;height:17px;border-radius:50%;display:none;align-items:center;justify-content:center;}
`;
document.head.appendChild(style);

// Close dropdown on outside click
document.addEventListener('click', function(e) {
  const wrap = document.getElementById('am-user-wrap');
  if (wrap && !wrap.contains(e.target)) wrap.classList.remove('open');
});

// Logout function
window.__amLogout = async function() {
  await signOut(auth);
  window.location.href = 'index.html';
};

// Main auth listener
onAuthStateChanged(auth, user => {
  updateCartBadge();

  // Find login button — works with both index.html and other pages
  const loginBtn  = document.querySelector('button.btn-login, a.btn-login, [data-nav-login]');
  const navActions = document.querySelector('.nav-actions, .nav-right');

  if (!navActions) return;

  if (user) {
    // Remove login button
    if (loginBtn) loginBtn.remove();

    // Remove existing user wrap if any
    const existing = document.getElementById('am-user-wrap');
    if (existing) existing.parentElement.remove();

    // Insert user dropdown before hamburger / last item
    const ham = navActions.querySelector('.hamburger, #hamburger');
    const userDiv = document.createElement('div');
    userDiv.innerHTML = buildUserDropdown(user);
    if (ham) {
      navActions.insertBefore(userDiv.firstElementChild, ham);
    } else {
      navActions.appendChild(userDiv.firstElementChild);
    }

    // Update mobile menu too
    const mobMenu = document.getElementById('mobMenu');
    if (mobMenu) {
      // Remove old login links from mobile menu
      mobMenu.querySelectorAll('a[href="login.html"]').forEach(a => a.remove());
      // Add dashboard link if not there
      if (!mobMenu.querySelector('[href="user-dashboard.html"]')) {
        const link = document.createElement('a');
        link.href = 'user-dashboard.html';
        link.textContent = '👤 My Dashboard';
        mobMenu.appendChild(link);
      }
    }
  } else {
    // Not logged in — make sure login button is visible
    // (it's already in HTML, just ensure user dropdown is removed)
    const wrap = document.getElementById('am-user-wrap');
    if (wrap) wrap.remove();
  }
});

// Listen for cart changes
window.addEventListener('storage', updateCartBadge);
document.addEventListener('am-cart-updated', updateCartBadge);