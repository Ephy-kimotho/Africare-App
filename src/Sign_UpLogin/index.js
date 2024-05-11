/* -----IMPORTS----- */

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

/* -----FIREBASE SETUP----- */
const firebaseConfig = {
  apiKey: "AIzaSyByGZAddHxzBd3PD_x88_VT_W0Dicdf7Fg",
  authDomain: "africare-84e5c.firebaseapp.com",
  projectId: "africare-84e5c",
  storageBucket: "africare-84e5c.appspot.com",
  messagingSenderId: "775578295208",
  appId: "1:775578295208:web:4534fa1e65539c0e695b9d"
};


const app = initializeApp(firebaseConfig)
const auth = getAuth(app)



/* ----- UI ELEMENTS----- */
const emailEl = document.getElementById("email")
const passwordEl = document.getElementById("password")

const emailErrorBox = document.getElementById("email-error-box")
const passwordErrorBox = document.getElementById("password-error-box")

const signInBtn = document.getElementById("sign-in-btn")
const createAccountBtn = document.getElementById("create-account-btn")




/*-----UI EVENT LISTENERS  */
createAccountBtn.addEventListener("click", authCreateAccount)
signInBtn.addEventListener("click", authSignIn)


emailEl.addEventListener("input", () => hideErrorMessage(emailEl, emailErrorBox));
passwordEl.addEventListener("input", () => hideErrorMessage(passwordEl, passwordErrorBox));


/* ----- FIREBASE AUTHENTICATION FUNCTIONS----- */


function authCreateAccount(e) {
  e.preventDefault()

  const email = emailEl.value
  const password = passwordEl.value
  clearInputFields()

  if (validateForm(email, password)) {

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        clearInputFields()
        showLoggedInView()
      })
      .catch(error => {
        displayErrorMessage(error.message)
      })
  }
}

function authSignIn(e) {
  e.preventDefault()
  const email = emailEl.value
  const password = passwordEl.value
  clearInputFields()

  if (validateForm(email, password)) {

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {

        clearInputFields()
        showLoggedInView()
      })
      .catch(error => {
        displayErrorMessage(error.message)
      })
  }
}



/* ----- UI FUNCTIONS----- */

function clearInputFields() {
  emailEl.value = ""
  passwordEl.value = ""
}

function showLoggedInView() {
  window.location.href = "http://localhost:3000"
}

function hideErrorMessage(inputField, errorBox) {
  if (inputField === document.activeElement) {
    errorBox.textContent = "";
  }
}

function clearErrorBoxes() {
  emailErrorBox.textContent = "";
  passwordErrorBox.textContent = "";
}

function validateForm(email, password) {
  const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  let isValid = true

  clearErrorBoxes()

  if (email.trim() === null || email.length === 0) {
    emailErrorBox.textContent = "kindly fill this field"
    isValid = false;
  } else if (!regex.test(email)) {
    emailErrorBox.textContent = "Kindly enter a valid email"
    isValid = false;
  }

  if (password.trim() === null || password.length === 0) {
    passwordErrorBox.textContent = "Kindly fill in this field";
    isValid = false;
  } else if (password.length < 8) {
    passwordErrorBox.textContent = "Password is too short";
    isValid = false;
  }
  return isValid

}
