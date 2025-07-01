import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const signupForm = document.querySelector('form');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('Name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPass = document.getElementById('confirm-pass').value;
    const role = document.querySelector('input[name="role"]:checked').value;

    if (password !== confirmPass) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Set the display name in Firebase Auth
        await updateProfile(user, {
            displayName: name
        });

        // Also store user info in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            role: role
        });

        alert("Signup successful!");
        window.location.href = "login.html";

    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            alert("This email is already registered. Please login instead.");
            window.location.href = "login.html"; 
        } else {
            alert(error.message);
        }
    }
});










