// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
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
    currentUserId = user.uid;
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

// Submit Question
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
      userId: currentUserId,
      answered: false,
      timestamp: new Date()
    });
    alert(`Question submitted! ID: ${docRef.id}`);
    questionInput.value = ''; // Reset input field
  } catch (error) {
    console.error("Error submitting question:", error);
    alert("Error submitting your question. Please try again.");
  }
});

// List Questions based on specific conditions
async function listQuestions(queryFilter = null) {
  try {
    let q;
    const questionsRef = collection(db, "Questions");
    
    if (queryFilter) {
      q = query(questionsRef, queryFilter);
    } else {
      q = query(questionsRef);
    }

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No questions found.");
      return [];
    }

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching questions:", error.message);
    return [];
  }
}

// Helper function to render questions in the DOM
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
      questionItem.innerHTML = `
        <strong>${q.question}</strong> (Answered: ${q.answered})
        <div>Tags: ${q.tags ? q.tags.join(", ") : "No tags"}</div>
        <div>Answer: ${q.answer || "No answer yet."}</div>
        <div>Comments: ${q.comments ? q.comments.map(c => c.text).join(", ") : "No comments yet."}</div>
        <button onclick="showAnswerForm('${q.id}')">Answer</button>
        <button onclick="showTagForm('${q.id}')">Add Tags</button>
        <button onclick="showCommentForm('${q.id}')">Add Comment</button>
      `;
      listContainer.appendChild(questionItem);
    });
  }

  outputDiv.appendChild(listContainer);
}

// Event listeners for fetching questions
document.getElementById("fetchUserQuestions").addEventListener("click", async () => {
  if (!currentUserId) {
    alert("Please log in first.");
    return;
  }
  const questions = await listQuestions(query(where("userId", "==", currentUserId)));
  renderQuestions("User Questions", questions);
});

document.getElementById("fetchAllQuestions").addEventListener("click", async () => {
  const questions = await listQuestions();
  renderQuestions("All Questions", questions);
});

document.getElementById("fetchUnansweredQuestions").addEventListener("click", async () => {
  const questions = await listQuestions(query(where("answered", "==", false)));
  renderQuestions("Unanswered Questions", questions);
});

document.getElementById("fetchAnsweredQuestions").addEventListener("click", async () => {
  const questions = await listQuestions(query(where("answered", "==", true)));
  renderQuestions("Answered Questions", questions);
});

// Search questions by keyword
async function searchQuestions(keyword) {
  const questions = await listQuestions();
  const matchingQuestions = questions.filter((q) => q.question.toLowerCase().includes(keyword.toLowerCase()));
  renderQuestions("Search Results", matchingQuestions, "searchResults");
}

// Event listeners for search
document.getElementById("searchQuestions").addEventListener("click", () => {
  const query = document.getElementById("searchQuery").value.trim();
  if (query) searchQuestions(query);
});

// Add tags to a question
async function addTagsToQuestion(questionId, tags) {
  try {
    const questionRef = doc(db, "Questions", questionId);
    await updateDoc(questionRef, { tags: arrayUnion(...tags) });
    console.log(`Tags added to question ID: ${questionId}`);
  } catch (error) {
    console.error("Error adding tags to question:", error.message);
  }
}

// Add a comment to a question
async function addCommentToQuestion(questionId, commentText) {
  try {
    const questionRef = doc(db, "Questions", questionId);
    await updateDoc(questionRef, {
      comments: arrayUnion({ text: commentText, timestamp: new Date() })
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
    await updateDoc(questionRef, { answer: answerText, answered: true });
    alert("Question answered!");
  } catch (error) {
    console.error("Error answering question:", error.message);
  }
}

// Filter questions by tag
async function filterQuestionsByTag(tag) {
  const questions = await listQuestions();
  const taggedQuestions = questions.filter((q) => q.tags && q.tags.includes(tag));
  renderQuestions(`Questions tagged with "${tag}"`, taggedQuestions);
}

// Event listeners for tag filtering
document.getElementById("filterByTag").addEventListener("click", () => {
  const tag = document.getElementById("filterTag").value.trim();
  if (tag) filterQuestionsByTag(tag);
});

// Assuming the functions are in a scope where they can be called globally.
document.addEventListener("DOMContentLoaded", () => {
  // Dynamically bind events after the DOM is fully loaded.

  const answerButtons = document.querySelectorAll(".answerButton");
  answerButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      const questionId = event.target.dataset.questionId;
      showAnswerForm(questionId);
    });
  });

  const tagButtons = document.querySelectorAll(".tagButton");
  tagButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      const questionId = event.target.dataset.questionId;
      showTagForm(questionId);
    });
  });

  const commentButtons = document.querySelectorAll(".commentButton");
  commentButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      const questionId = event.target.dataset.questionId;
      showCommentForm(questionId);
    });
  });
});

// Answer function
function showAnswerForm(questionId) {
  const answerText = prompt("Enter your answer:");
  if (answerText) {
    answerQuestion(questionId, answerText);
  }
}

// Tag function
function showTagForm(questionId) {
  const tags = prompt("Enter tags (comma separated):").split(",");
  if (tags.length > 0) {
    addTagsToQuestion(questionId, tags.map(tag => tag.trim()));
  }
}

// Comment function
function showCommentForm(questionId) {
  const commentText = prompt("Enter your comment:");
  if (commentText) {
    addCommentToQuestion(questionId, commentText);
  }
}


