import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAX40PIcTdMLdaKk4EkVdwqfzCrybDxhLg",
    authDomain: "velunora-e4c6f.firebaseapp.com",
    projectId: "velunora-e4c6f",
    storageBucket: "velunora-e4c6f.appspot.com",
    messagingSenderId: "670245806188",
    appId: "1:670245806188:web:75a31084ee1c94a374f849"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

