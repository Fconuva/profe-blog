// Shared Firebase configuration for client-side pages
// Used by: cuenta/, dashboard/, admin/

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCzN4xNEE_hKshXbsVqLhWSnzet1pHwRh8",
  authDomain: "profe-blog.firebaseapp.com",
  databaseURL: "https://profe-blog-default-rtdb.firebaseio.com",
  projectId: "profe-blog",
  storageBucket: "profe-blog.firebasestorage.app",
  messagingSenderId: "305920739217",
  appId: "1:305920739217:web:2e08c7469d2988d8b3bc30"
};

// Admin UID — only this user can access admin panel
const ADMIN_UID = null; // Will be set after first admin login
