// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

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

// Initialize collection reference
const colRef = collection(db, "Mazhab");

// Fetch collection data
getDocs(colRef)
  .then((snapshot) => {
    snapshot.docs.forEach(doc => {
      console.log(doc.id, " => ", doc.data()); // Handle each document in the collection
    });
  })
  .catch((error) => {
    console.error("Error fetching collection data:", error);
  });
