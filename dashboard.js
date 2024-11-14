// Import the Firebase modules
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

// Add event listener to the button
fetchDataButton.addEventListener('click', async () => {
  // Specify the collection and document to fetch data from
  const docRef = doc(db, "Mazhab", "Toheed");

  // Fetch the document data
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Display the data in the HTML
      titleDisplay.innerText = `Title: ${data}`;
      descriptionDisplay.innerText = `Description: ${data.answer}`;
    } else {
      console.log("No such document!");
      titleDisplay.innerText = "Document not found";
      descriptionDisplay.innerText = "Please check if the 'Toheed' collection and 'Mazhab' document exist.";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    titleDisplay.innerText = "Error fetching data";
    descriptionDisplay.innerText = `Error: ${error.message}`;
  }
});
