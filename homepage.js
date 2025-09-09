import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBh3qpbVYSmkVNDiporY3JqPP1t0ZktbHk",
  authDomain: "login-form-dbf3f.firebaseapp.com",
  projectId: "login-form-dbf3f",
  storageBucket: "login-form-dbf3f.appspot.com",
  messagingSenderId: "296020257664",
  appId: "1:296020257664:web:a7dab575a69ad5066fef65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");

  if (loggedInUserId && user) {
    try {
      const docRef = doc(db, "users", loggedInUserId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        document.getElementById("loggedUserFName").innerText = userData.firstName;
        document.getElementById("loggedUserLName").innerText = userData.lastName;
        document.getElementById("loggedUserEmail").innerText = userData.email;
      } else {
        console.log("No Firestore document found for this user ID");
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  } else {
    console.log("No logged in user, redirecting...");
    window.location.href = "index.html";
  }
});

// Logout
const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
});
