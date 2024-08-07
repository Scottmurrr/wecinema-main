import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBFFVP4F_tq9yfgra1szbT1yWFh_SCCGMg",
    authDomain: "wecinema.co",
    projectId: "wecinema-5b6a4",
    storageBucket: "wecinema-5b6a4.appspot.com",
    messagingSenderId: "962978250768",
    appId: "1:962978250768:web:21d326bc46b6e1874bca95",
    measurementId: "G-Y1ZC282HZK"
  };

const appp = initializeApp(firebaseConfig);
const auth = getAuth(appp);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, appp};