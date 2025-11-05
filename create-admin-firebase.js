// 🔥 SCRIPT PARA FIREBASE CONSOLE - CREAR USUARIO ADMIN
// Copiar y pegar en la consola del navegador en Firebase Database

// 1. Ve a: https://console.firebase.google.com/project/profe-blog/database/profe-blog-default-rtdb/data
// 2. Abre DevTools (F12) → Pestaña Console
// 3. Copia y pega este código completo
// 4. Presiona Enter

const adminUID = 'WRGRvv9IcabwHK8DSXSNhcjLr5Z2';

const adminData = {
  email: "fconuva@gmail.com",
  username: "fconuva",
  password: "eGl4bzk3ODc5Mzc1",  // xixo97879375 en Base64
  role: "admin",
  active: true,
  createdAt: new Date().toISOString(),
  permissions: {
    basica: true,
    especial: true,
    media: true,
    parvularia: true,
    indigena: true,
    privado: true
  },
  devices: {},
  loginHistory: []
};

// Usar Firebase de la página
firebase.database().ref(`users/${adminUID}`).set(adminData)
  .then(() => {
    console.log('✅ Usuario admin creado correctamente!');
    console.log('UID:', adminUID);
    console.log('Email:', adminData.email);
    console.log('Username:', adminData.username);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
  });
