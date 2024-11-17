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




// Helper function to render questions in the DOM
function renderQuestions(title, questions) {
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = ""; // Clear previous output

  const listTitle = document.createElement("h3");
  listTitle.textContent = title;
  outputDiv.appendChild(listTitle);

  const listContainer = document.createElement("div");
  listContainer.className = "question-list";

  if (questions.length === 0) {
    listContainer.textContent = "No questions found.";
  } else {
    questions.forEach((question) => {
      const questionItem = document.createElement("div");
      questionItem.className = "question-item";
      questionItem.textContent = `${question.question} (Answered: ${question.answered})`;
      listContainer.appendChild(questionItem);
    });
  }

  outputDiv.appendChild(listContainer);
}

// Fetch user questions and display them
document.getElementById("fetchUserQuestions").addEventListener("click", async () => {
  if (!currentUserId) {
    alert("Please log in first.");
    return;
  }

  try {
    const questionsRef = collection(db, "Questions");
    const q = query(questionsRef, where("userId", "==", currentUserId));
    const querySnapshot = await getDocs(q);

    const questions = querySnapshot.docs.map((doc) => doc.data());
    renderQuestions("User Questions", questions);
  } catch (error) {
    console.error("Error fetching user questions:", error.message);
  }
});

// Fetch all questions and display them
document.getElementById("fetchAllQuestions").addEventListener("click", async () => {
  try {
    const questionsRef = collection(db, "Questions");
    const querySnapshot = await getDocs(questionsRef);

    const questions = querySnapshot.docs.map((doc) => doc.data());
    renderQuestions("All Questions", questions);
  } catch (error) {
    console.error("Error fetching all questions:", error.message);
  }
});

// Fetch unanswered questions and display them
document.getElementById("fetchUnansweredQuestions").addEventListener("click", async () => {
  try {
    const questionsRef = collection(db, "Questions");
    const q = query(questionsRef, where("answered", "==", false));
    const querySnapshot = await getDocs(q);

    const questions = querySnapshot.docs.map((doc) => doc.data());
    renderQuestions("Unanswered Questions", questions);
  } catch (error) {
    console.error("Error fetching unanswered questions:", error.message);
  }
});

// Fetch answered questions and display them
document.getElementById("fetchAnsweredQuestions").addEventListener("click", async () => {
  try {
    const questionsRef = collection(db, "Questions");
    const q = query(questionsRef, where("answered", "==", true));
    const querySnapshot = await getDocs(q);

    const questions = querySnapshot.docs.map((doc) => doc.data());
    renderQuestions("Answered Questions", questions);
  } catch (error) {
    console.error("Error fetching answered questions:", error.message);
  }
});



// Add tags to a question
async function addTagsToQuestion(questionId, tags) {
  try {
    const questionRef = doc(db, "Questions", questionId);
    await updateDoc(questionRef, {
      tags: tags // Array of tags
    });
    alert(`Tags added to question ID: ${questionId}`);
  } catch (error) {
    console.error("Error adding tags to question:", error.message);
  }
}

// Search questions by keyword
async function searchQuestions(keyword) {
  try {
    const questionsRef = collection(db, "Questions");
    const querySnapshot = await getDocs(questionsRef);

    const matchingQuestions = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((q) => q.question.toLowerCase().includes(keyword.toLowerCase()));

    renderQuestions("Search Results", matchingQuestions, "searchResults");
  } catch (error) {
    console.error("Error searching questions:", error.message);
  }
}

// Add comments to a question
async function addCommentToQuestion(questionId, commentText) {
  try {
    const questionRef = doc(db, "Questions", questionId);
    await updateDoc(questionRef, {
      comments: arrayUnion({ text: commentText, timestamp: new Date() }) // Add comment
    });
    alert("Comment added!");
  } catch (error) {
    console.error("Error adding comment:", error.message);
  }
}

// Answer a question
async function answerQuestion(questionId, answerText) {
  try {
    const questionRef = doc(db, "Questions", questionId);
    await updateDoc(questionRef, {
      answer: answerText,
      answered: true
    });
    alert("Question answered!");
  } catch (error) {
    console.error("Error answering question:", error.message);
  }
}

// Filter questions by tag
async function filterQuestionsByTag(tag) {
  try {
    const questionsRef = collection(db, "Questions");
    const querySnapshot = await getDocs(questionsRef);

    const taggedQuestions = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((q) => q.tags && q.tags.includes(tag));

    renderQuestions(`Questions tagged with "${tag}"`, taggedQuestions);
  } catch (error) {
    console.error("Error filtering questions by tag:", error.message);
  }
}

// Render comments for a question
function renderComments(comments) {
  if (!comments || comments.length === 0) return "No comments yet.";
  return comments
    .map((c) => `<div class="comment-item">${c.text} - ${new Date(c.timestamp).toLocaleString()}</div>`)
    .join("");
}

// Render questions and comments
function renderQuestions(title, questions, containerId = "output") {
  const outputDiv = document.getElementById(containerId);
  outputDiv.innerHTML = ""; // Clear previous output

  const listTitle = document.createElement("h3");
  listTitle.textContent = title;
  outputDiv.appendChild(listTitle);

  const listContainer = document.createElement("div");
  listContainer.className = "question-list";

  if (questions.length === 0) {
    listContainer.textContent = "No questions found.";
  } else {
    questions.forEach((q) => {
      const questionItem = document.createElement("div");
      questionItem.className = "question-item";

      const tags = (q.tags || []).map((t) => `<span class="tag">${t}</span>`).join("");
      const comments = renderComments(q.comments);

      questionItem.innerHTML = `
        <strong>${q.question}</strong> (Answered: ${q.answered})
        <div>Tags: ${tags}</div>
        <div>Answer: ${q.answer || "No answer yet."}</div>
        <div>Comments:</div>
        ${comments}
      `;
      listContainer.appendChild(questionItem);
    });
  }

  outputDiv.appendChild(listContainer);
}

// Event listeners
document.getElementById("searchQuestions").addEventListener("click", () => {
  const query = document.getElementById("searchQuery").value.trim();
  if (query) searchQuestions(query);
});

document.getElementById("filterByTag").addEventListener("click", () => {
  const tag = document.getElementById("filterTag").value.trim();
  if (tag) filterQuestionsByTag(tag);
});
