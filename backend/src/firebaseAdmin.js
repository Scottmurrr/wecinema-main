require('dotenv').config(); // Load environment variables from .env file
const admin = require('firebase-admin');

// Parse the service account JSON string from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});

module.exports = admin;
