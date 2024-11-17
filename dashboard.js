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
const fetchDataButton = document.getElementById("fetchDataButton");
const titleDisplay = document.getElementById("title");
const descriptionDisplay = document.getElementById("description");
const questionDisplay = document.getElementById("question");
const answerDisplay = document.getElementById("answer");

// Fetch document data and display
fetchDataButton.addEventListener("click", async () => {
  const docRef = doc(db, "Mazhab", "Toheed");
  console.log("Fetching document:", docRef.path);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Document data:", data);

      titleDisplay.innerText = `Title: ${data.title || "No title available"}`;
      descriptionDisplay.innerText = `Description: ${data.description || "No description available"}`;
      questionDisplay.innerText = `Question: ${data.Question || "No question available"}`;
      answerDisplay.innerText = `Answer: ${data.Answer || "No answer available"}`;
    } else {
      console.log("No such document found.");
      titleDisplay.innerText = "Document not found";
      descriptionDisplay.innerText =
        "Please ensure the 'Mazhab' collection and 'Toheed' document exist.";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    titleDisplay.innerText = "Error fetching data";
    descriptionDisplay.innerText = `Error: ${error.message}`;
  }
});

// Submit question to Firestore
document.getElementById("questionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const questionText = document.getElementById("question").value;

  try {
    const docRef = await addDoc(collection(db, "Questions"), { question: questionText });
    alert(`Question submitted! ID: ${docRef.id}`);
    document.getElementById("questionForm").reset();
  } catch (error) {
    console.error("Error submitting question:", error);
    alert("Error submitting your question. Please try again.");
  }
});
