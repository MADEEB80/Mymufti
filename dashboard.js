// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

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
const auth = getAuth(app);

// Global variable to store the current user's ID
let currentUserId = null;

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid; // Firebase-generated unique user ID
    console.log("User logged in with ID:", currentUserId);
  } else {
    console.log("No user is signed in.");
    // Optionally redirect to login page
  }
});

// User Login Function
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user.uid);
  } catch (error) {
    console.error("Error logging in:", error.message);
  }
}

// User Sign-Up Function
async function signUpUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up with ID:", userCredential.user.uid);
  } catch (error) {
    console.error("Error signing up:", error.message);
  }
}

// 1. Submit Question
document.getElementById("questionForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const questionInput = document.getElementById("askquestion");
  const questionText = questionInput.value.trim();

  if (!questionText) {
    alert("Please enter a question before submitting.");
    return;
  }

  if (!currentUserId) {
    alert("Unable to identify user. Please log in and try again.");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "Questions"), {
      question: questionText,
      userId: currentUserId, // Automatically use Firebase `uid`
      answered: false,
      timestamp: new Date()
    });
    alert(`Question submitted! ID: ${docRef.id}`);
    document.getElementById("questionForm").reset();
  } catch (error) {
    console.error("Error submitting question:", error);
    alert("Error submitting your question. Please try again.");
  }
});



async function listUserQuestions(userId) {
  try {
    const questionsRef = collection(db, "Questions");
    const q = query(questionsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No questions found for this user.");
    } else {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    }
  } catch (error) {
    console.error("Error fetching user's questions:", error.message);
  }
}



async function listAllQuestions() {
  try {
    const questionsRef = collection(db, "Questions");
    const querySnapshot = await getDocs(questionsRef);

    if (querySnapshot.empty) {
      console.log("No questions found.");
    } else {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    }
  } catch (error) {
    console.error("Error fetching all questions:", error.message);
  }
}



async function listUnansweredQuestions() {
  try {
    const questionsRef = collection(db, "Questions");
    const q = query(questionsRef, where("answered", "==", false));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No unanswered questions found.");
    } else {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    }
  } catch (error) {
    console.error("Error fetching unanswered questions:", error.message);
  }
}


async function listAnsweredQuestions() {
  try {
    const questionsRef = collection(db, "Questions");
    const q = query(questionsRef, where("answered", "==", true));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No answered questions found.");
    } else {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    }
  } catch (error) {
    console.error("Error fetching answered questions:", error.message);
  }
}



async function addTagsToQuestion(questionId, tags) {
  try {
    const questionRef = doc(db, "Questions", questionId);

    // Add or update the 'tags' field
    await updateDoc(questionRef, {
      tags: tags // Pass an array of tags
    });

    console.log(`Tags added to question ID: ${questionId}`);
  } catch (error) {
    console.error("Error adding tags to question:", error.message);
  }
}
