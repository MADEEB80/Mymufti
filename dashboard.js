import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMk112qoe44Ac81SjvAd4Y9XLvN3c",
  authDomain: "mymufti1080.firebaseapp.com",
  projectId: "mymufti1080",
  storageBucket: "mymufti1080.appspot.com",
  messagingSenderId: "558044786458",
  appId: "1:558044786458:web:df4441667e5d71c1dcc6a3",
  measurementId: "G-LY1D6LNG6F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('fetchDataButton').addEventListener('click', async () => {
  const docRef = doc(db, "Mazhab", "Toheed");
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById('title').innerText = `Title: ${data.title || "No title available"}`;
      document.getElementById('description').innerText = `Description: ${data.description || "No description available"}`;
      document.getElementById('question').innerText = `Question: ${data.Question || "No question available"}`;
      document.getElementById('answer').innerText = `Answer: ${data.Answer || "No answer available"}`;
    } else {
      alert("Document not found!");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    alert("Error fetching data!");
  }
});

// Form submission handler
document.getElementById('questionForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  // Get the question input value
  const questionText = document.getElementById('question').value.trim();

  // Check if the question is valid
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
    
    // Inform the user that the question was submitted successfully
    alert("Your question has been submitted successfully!");
    
    // Clear the form input after submission
    document.getElementById('question').value = "";

  } catch (error) {
    console.error("Error submitting question: ", error);
    alert("There was an error submitting your question. Please try again.");
  }
});
