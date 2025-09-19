import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

const firebaseConfig = {
//firebase api
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
}

// ---------------- SIGN UP ----------------
const signUp=document.getElementById('submitSignUp');
signUp.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('rEmail').value;
    const password=document.getElementById('rPassword').value;
    const firstName=document.getElementById('fName').value;
    const lastName=document.getElementById('lName').value;

    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email: email,
            firstName: firstName,
            lastName:lastName
        };
        showMessage('✅ Account Created Successfully', 'signUpMessage');
        const docRef=doc(db, "users", user.uid);
        return setDoc(docRef,userData);
    })
    .then(()=>{
        window.location.href='index.html';
    })
    .catch((error)=>{
        console.error("Sign Up Error:", error.code, error.message);
        if(error.code==='auth/email-already-in-use'){
            showMessage('❌ Email Address Already Exists !!!', 'signUpMessage');
        }
        else if(error.code==='auth/weak-password'){
            showMessage('❌ Password must be at least 6 characters', 'signUpMessage');
        }
        else if(error.code==='auth/invalid-email'){
            showMessage('❌ Invalid Email Address', 'signUpMessage');
        }
        else{
            showMessage('❌ '+error.message, 'signUpMessage');
        }
    });
});

// ---------------- SIGN IN ----------------
const signIn=document.getElementById('submitSignIn');
signIn.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email,password)
    .then((userCredential)=>{
        showMessage('✅ Login is successful', 'signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href='homepage.html';
    })
    .catch((error)=>{
        console.error("Sign In Error:", error.code, error.message);
        if(
            error.code==='auth/wrong-password' || 
            error.code==='auth/user-not-found' || 
            error.code==='auth/invalid-login-credentials'
        ){
            showMessage('❌ Incorrect Email or Password', 'signInMessage');
        }
        else{
            showMessage('❌ '+error.message, 'signInMessage');
        }
    });
});

