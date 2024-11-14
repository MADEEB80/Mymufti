// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

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

// Get references to HTML elements
const fetchDataButton = document.getElementById('fetchDataButton');
const dataDisplay = document.getElementById('dataDisplay');

// Add event listener to fetch data
fetchDataButton.addEventListener('click', async () => {
  try {
    // Clear previous data
    dataDisplay.innerHTML = "";

    // Fetch all documents from the "Toheed" collection
    const querySnapshot = await getDocs(collection(db, "Toheed"));

    // If collections exist, loop through each document
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const title = data.title || "No title available";
      const description = data.description || "No description available";

      // Create HTML elements for each document
      const documentElement = document.createElement('div');
      const titleElement = document.createElement('h2');
      const descriptionElement = document.createElement('p');

      titleElement.innerText = `Title: ${title}`;
      descriptionElement.innerText = `Description: ${description}`;

      documentElement.appendChild(titleElement);
      documentElement.appendChild(descriptionElement);

      // Append the document to the data display section
      dataDisplay.appendChild(documentElement);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    dataDisplay.innerHTML = "<h2>Error fetching data</h2><p>" + error.message + "</p>";
  }
});
