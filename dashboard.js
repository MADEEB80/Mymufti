// Import the Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

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

// Collection reference
const colRef = collection(db, "Mazhab");

// Fetch and log collection data (optional for debugging)
getDocs(colRef)
  .then((snapshot) => {
    console.log("Collection Data:", snapshot.docs);
  })
  .catch((error) => {
    console.error("Error fetching collection data:", error);
  });

// Add event listener to the button
fetchDataButton.addEventListener('click', async () => {
  // Specify the collection and document to fetch data from
  const docRef = doc(db, "Toheed", "Mazhab");

  try {
    // Fetch the document data
    const docSnap = await getDoc(docRef);

    // Check if the document exists
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Display the fetched data in the HTML
      titleDisplay.innerText = `Title: ${data.title || "No title available"}`;
      descriptionDisplay.innerText = `Description: ${data.description || "No description available"}`;
      console.log("Document data:", data);
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
