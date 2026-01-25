// Firebase configuration for MyArk
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAS6sSC9lakDPTcz9OPQfo89tLkvcaX3rY",
    authDomain: "myark-dbbee.firebaseapp.com",
    projectId: "myark-dbbee",
    storageBucket: "myark-dbbee.firebasestorage.app",
    messagingSenderId: "1012733770035",
    appId: "1:1012733770035:web:0fc2b6d5a627c05937e646",
    measurementId: "G-DT3CW7GT1B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Analytics (only in browser)
export const initAnalytics = async () => {
    if (await isSupported()) {
        return getAnalytics(app);
    }
    return null;
};

export default app;
