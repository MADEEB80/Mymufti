// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

// Firebase Configuration
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

// Get references to the HTML elements
const fetchDataButton = document.getElementById('fetchDataButton');
const titleDisplay = document.getElementById('title');
const descriptionDisplay = document.getElementById('description');
const questionDisplay = document.getElementById('question');
const answerDisplay = document.getElementById('answer');

fetchDataButton.addEventListener('click', async () => {
  // Reference to the 'Toheed' document inside the 'Mazhab' collection
  const docRef = doc(db, "Mazhab", "Toheed");

  console.log("Fetching document:", docRef.path);  // Log the correct document path

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Document data:", data);  // Log the fetched data
      titleDisplay.innerText = `Title: ${data.title || "No title available"}`;
      descriptionDisplay.innerText = `Description: ${data.description || "No description available"}`;
      questionDisplay.innerText = `Question: ${data.Question || "No question available"}`;
      answerDisplay.innerText = `Answer: ${data.Answer || "No answer available"}`;
    } else {
      console.log("No such document!");  // Log when the document is not found
      titleDisplay.innerText = "Document not found";
      descriptionDisplay.innerText = "Please check if the 'Mazhab' collection and 'Toheed' document exist.";
    }
  } catch (error) {
    console.error("Error fetching data:", error);  // Log any errors
    titleDisplay.innerText = "Error fetching data";
    descriptionDisplay.innerText = `Error: ${error.message}`;
  }
});


document.addEventListener('DOMContentLoaded', () => {
  // Your code here
  const questionForm = document.getElementById('questionForm');
  const questionInput = document.getElementById('question');

  questionForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page on submission

    const questionText = questionInput.value.trim();

    if (questionText === "") {
      alert("Please enter a question!");
      return;
    }

    try {
      // Add the question to Firestore
      const docRef = await addDoc(collection(db, "Questions"), {
        question: questionText,
        createdAt: new Date(),
      });

      console.log("Document written with ID: ", docRef.id);

      // Provide feedback to the user
      alert("Your question has been submitted successfully!");

      // Optionally clear the form
      questionInput.value = "";
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("There was an error submitting your question. Please try again.");
    }
  });
});
