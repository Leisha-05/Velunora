import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { app } from "../login_signup/firebase.js"; // ensure your firebase.js exports `app`

const auth = getAuth(app);
const db = getFirestore(app);

export function setupWishlistIcons() {
    const wishlistIcons = document.querySelectorAll(".wishlist-icon");

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            const anon = await signInAnonymously(auth);
            user = anon.user;
        }

        const uid = user.uid;
        const docRef = doc(db, "userWishlists", uid);
        let wishlist = [];
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            wishlist = snap.data().wishlist || [];
        }

        wishlistIcons.forEach(icon => {
            const productName = icon.dataset.productName?.trim();
            if (!productName) return;

            const isWishlisted = wishlist.includes(productName);

            // Set initial color
            if (isWishlisted) {
                icon.classList.add("wishlisted");
                icon.style.color = "red";
            } else {
                icon.classList.remove("wishlisted");
                icon.style.color = "";
            }

            icon.addEventListener("click", async (e) => {
                e.stopPropagation();
                const snapLatest = await getDoc(docRef);
                const currentWishlist = snapLatest.exists() ? snapLatest.data().wishlist || [] : [];

                if (currentWishlist.includes(productName)) {
                    await updateDoc(docRef, { wishlist: arrayRemove(productName) });
                    icon.classList.remove("wishlisted");
                    icon.style.color = "";
                } else {
                    await updateDoc(docRef, { wishlist: arrayUnion(productName) }).catch(async () => {
                        await setDoc(docRef, { wishlist: [productName] });
                    });
                    icon.classList.add("wishlisted");
                    icon.style.color = "red";
                }
            });
        });
    });
}
