import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const loginForm = document.querySelector('form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            const userData = userDoc.data();
            alert(`Login successful! Welcome, ${userData.name} (${userData.role})`);

            if (userData.role === 'creator') {
                window.location.href = "creator_dashboard.html";
            } else {
                window.location.href = "index.html";
            }
        } else {
            alert("No user data found.");
        }
    } catch (error) {
        alert(error.message);
    }
});











