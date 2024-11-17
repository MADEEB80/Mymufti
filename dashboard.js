// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

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

// 1. Submit Question
document.getElementById("questionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const questionInput = document.getElementById("askquestion");
  const questionText = questionInput.value.trim();

  // Validate input
  if (!questionText) {
    alert("Please enter a question before submitting.");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "Questions"), {
      question: questionText,
      userId: "exampleUserId", // Replace with actual user ID if available
      answered: false, // New questions are unanswered by default
      timestamp: new Date() // Store submission time
    });
    alert(`Question submitted! ID: ${docRef.id}`);
    document.getElementById("questionForm").reset();
  } catch (error) {
    console.error("Error submitting question:", error);
    alert("Error submitting your question. Please try again.");
  }
});

// 2. List Questions of a Specific User
async function listUserQuestions(userId) {
  const q = query(collection(db, "Questions"), where("userId", "==", userId));
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

// Example Usage
document.getElementById("fetchUserQuestions").addEventListener("click", () => {
  listUserQuestions("exampleUserId"); // Replace with dynamic user ID
});

document.getElementById("fetchAllQuestions").addEventListener("click", listAllQuestions);

document.getElementById("fetchUnansweredQuestions").addEventListener("click", listUnansweredQuestions);
