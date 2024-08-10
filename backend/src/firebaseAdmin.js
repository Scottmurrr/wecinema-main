require('dotenv').config(); // Load environment variables from .env file
console.log(process.env.FIREBASE_SERVICE_ACCOUNT); // Check if this outputs the correct JSON string

const admin = require('firebase-admin');
const fs = require('fs');

// Parse the service account JSON string from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
