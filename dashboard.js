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

   // Add event listener to fetch data
    fetchDataButton.addEventListener('click', async () => {
      try {
        // Fetch all collections
        const querySnapshot = await getDocs(collection(db, "Toheed"));
        
        // If collections exist, loop through each document
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());  // Log document ID and data to console
          titleDisplay.innerText = `Title: ${doc.data().title}`;  // Assuming "title" is a field
          descriptionDisplay.innerText = `Description: ${doc.data().description}`;  // Assuming "description" is a field
        });
        
      } catch (error) {
        console.error("Error fetching data:", error);
        titleDisplay.innerText = "Error fetching data";
        descriptionDisplay.innerText = error.message;
      }
    });