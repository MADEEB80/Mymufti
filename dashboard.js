// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getFirestore, doc, getDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

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

// DOM references
const fetchDataButton = document.getElementById('fetchDataButton');
const titleDisplay = document.getElementById('title');
const descriptionDisplay = document.getElementById('description');
const questionDisplay = document.getElementById('question');
const answerDisplay = document.getElementById('answer');


document.addEventListener('DOMContentLoaded', async () => {
  const questionForm = document.getElementById('questionForm');
  const questionInput = document.getElementById('question');

  // Check if questionInput is properly defined
  if (!questionInput) {
    console.error("Element with ID 'question' not found.");
    return;
  }

  questionForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission from reloading the page

    // Trimmed value of questionInput
    const questionText = questionInput.value?.trim(); 
    if (!questionText) {
      alert("Please enter a question!");
      return;
    }

    // Proceed with submission logic if questionText is valid
    try {
      const docRef = await addDoc(collection(db, "Questions"), {
        question: questionText,
        createdAt: new Date(),
      });

      console.log("Document written with ID: ", docRef.id);
      alert("Your question has been submitted successfully!");
      questionInput.value = ""; // Clear the form
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("There was an error submitting your question. Please try again.");
    }
  });
});
