import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { app } from "../login_signup/firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);

export function setupCartIcons() {
    const cartIcons = document.querySelectorAll(".cart-icon");

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            const anon = await signInAnonymously(auth);
            user = anon.user;
        }

        const uid = user.uid;
        const docRef = doc(db, "userCarts", uid);
        let cart = [];
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            cart = snap.data().cart || [];
        }

        cartIcons.forEach(icon => {
            const productName = icon.dataset.productName?.trim();
            if (!productName) return;

            const isInCart = cart.includes(productName);

            // Set initial color
            if (isInCart) {
                icon.classList.add("carted");
                icon.style.color = "green";
            } else {
                icon.classList.remove("carted");
                icon.style.color = "";
            }

            icon.addEventListener("click", async (e) => {
                e.stopPropagation();
                const snapLatest = await getDoc(docRef);
                const currentCart = snapLatest.exists() ? snapLatest.data().cart || [] : [];

                if (currentCart.includes(productName)) {
                    await updateDoc(docRef, { cart: arrayRemove(productName) });
                    icon.classList.remove("carted");
                    icon.style.color = "";
                } else {
                    await updateDoc(docRef, { cart: arrayUnion(productName) }).catch(async () => {
                        await setDoc(docRef, { cart: [productName] });
                    });
                    icon.classList.add("carted");
                    icon.style.color = "green";
                }
            });
        });
    });
}
