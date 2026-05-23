const admin = require("firebase-admin");

// Note: To use Firebase Admin, you usually provide a service account key.
// For development, if we just need to verify tokens and the app is created in Firebase console, 
// we can initialize it without credentials if the environment variable GOOGLE_APPLICATION_CREDENTIALS is set,
// or we can just initialize an empty app if we provide the projectId.
// The user will need to provide a serviceAccountKey.json later or configure it via env variables.

// For now, we initialize it using env variables, expecting the user to set them.
try {
  admin.initializeApp({
    projectId: 'autocare-f9dcc',
  });
} catch (e) {
  // Ignore already initialized errors
  if (e.code !== 'app/duplicate-app') {
    console.error('Firebase Admin Init Error:', e);
  }
}

module.exports = admin;
