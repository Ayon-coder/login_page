// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getDatabase, ref, set } 
  from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

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

// Show message function
function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 4000);
}

// ================= SIGN UP ==================
const signUp = document.getElementById("submitSignUp");
signUp.addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;

  const auth = getAuth();
  const db = getDatabase();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
      };

      // Save user to Realtime Database
      set(ref(db, "users/" + user.uid), userData)
        .then(() => {
          showMessage("✅ Account Created Successfully", "signUpMessage");

          // Delay redirect so user can see the message
          setTimeout(() => {
            window.location.href = "index.html";
          }, 2000);
        })
        .catch((error) => {
          console.error("Error writing user data:", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use") {
        showMessage("⚠️ Email Address Already Exists !!!", "signUpMessage");
      } else {
        showMessage("❌ Unable to create user", "signUpMessage");
      }
    });
});

// ================= SIGN IN ==================
const signIn = document.getElementById("submitSignIn");
signIn.addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      showMessage("✅ Login successful", "signInMessage");

      // Save userId in localStorage
      localStorage.setItem("loggedInUserId", user.uid);

      // Delay redirect so message is visible
      setTimeout(() => {
        window.location.href = "homepage.html";
      }, 2000);
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        showMessage("⚠️ Incorrect Email or Password", "signInMessage");
      } else {
        showMessage("❌ Account does not exist", "signInMessage");
      }
    });
});
