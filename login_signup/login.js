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
    const userData = userDoc.data();

    alert(`Welcome back, ${userData.name}! You have successfully logged in as ${userData.role}.`);


    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("userEmail", email);

    if (userData.role === "creator") {
      window.location.href = "../index.html";
    } else {
      window.location.href = "../index.html";
    }
  } catch (error) {
    alert(error.message);
  }
});

        











