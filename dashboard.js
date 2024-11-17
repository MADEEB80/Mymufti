// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMk112qoe44Ac81SjvAd4Y9XLvNwwtN3c",
  authDomain: "mymufti1080.firebaseapp.com",
  projectId: "mymufti1080",
  storageBucket: "mymufti1080.appspot.com",
  messagingSenderId: "558044786458",
  appId: "1:558044786458:web:df4441667e5d71c1dcc6a3",
  measurementId: "G-LY1D6LNG6F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Global variable to store the current user's ID
let currentUserId = null;

// Authenticate user (anonymous sign-in)
signInAnonymously(auth).catch((error) => {
  console.error("Authentication error:", error);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid; // Automatically assigned user ID
    console.log("User ID:", currentUserId);
  } else {
    console.log("No user is signed in.");
  }
});

// 1. Submit Question
document.getElementById("questionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const questionInput = document.getElementById("askquestion");
  const questionText = questionInput.value.trim();

  if (!questionText) {
    alert("Please enter a question before submitting.");
    return;
  }

  if (!currentUserId) {
    alert("Unable to identify user. Please try again.");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "Questions"), {
      question: questionText,
      userId: currentUserId, // Automatically assigned user ID
      answered: false,
      timestamp: new Date()
    });
    alert(`Question submitted! ID: ${docRef.id}`);
    document.getElementById("questionForm").reset();
  } catch (error) {
    console.error("Error submitting question:", error);
    alert("Error submitting your question. Please try again.");
  }
});

// 2. List Questions of a Specific User
async function listUserQuestions() {
  if (!currentUserId) {
    alert("Unable to identify user. Please try again.");
    return;
  }

  const q = query(collection(db, "Questions"), where("userId", "==", currentUserId));
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (error) {
    console.error("Error fetching user's questions:", error);
  }
}

// 3. List All Questions
async function listAllQuestions() {
  const q = query(collection(db, "Questions"));
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (error) {
    console.error("Error fetching all questions:", error);
  }
}

// 4. List All Unanswered Questions
async function listUnansweredQuestions() {
  const q = query(collection(db, "Questions"), where("answered", "==", false));
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (error) {
    console.error("Error fetching unanswered questions:", error);
  }
}

// Event Listeners for Additional Features
document.getElementById("fetchUserQuestions").addEventListener("click", listUserQuestions);

document.getElementById("fetchAllQuestions").addEventListener("click", listAllQuestions);

document.getElementById("fetchUnansweredQuestions").addEventListener("click", listUnansweredQuestions);
