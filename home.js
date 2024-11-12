// Firebase Initialization
const firebaseConfig = {
  apiKey: "AIzaSyCMk112qoe44Ac81SjvAd4Y9XLvNwwtN3c",
  authDomain: "mymufti1080.firebaseapp.com",
  projectId: "mymufti1080",
  storageBucket: "mymufti1080.appspot.com",
  messagingSenderId: "558044786458",
  appId: "1:558044786458:web:df4441667e5d71c1dcc6a3",
  measurementId: "G-LY1D6LNG6F"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Tab Switching Functionality
function activateTab(tab) {
  document.getElementById('loginTab').classList.toggle('active', tab === 'login');
  document.getElementById('signupTab').classList.toggle('active', tab === 'signup');
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('signupForm').style.display = tab === 'signup' ? 'block' : 'none';
}

// Event listeners for tab switching
document.getElementById('loginTab').addEventListener('click', () => activateTab('login'));
document.getElementById('signupTab').addEventListener('click', () => activateTab('signup'));

// Display Error Messages
function displayErrorMessage(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  } else {
    console.warn(`Error element with ID '${elementId}' not found.`);
  }
}

// Clear Error Messages
function clearErrorMessages() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(errorElement => {
    errorElement.style.display = 'none';
    errorElement.textContent = '';
  });
}

// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  clearErrorMessages();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User logged in:", userCredential.user);
      window.location.href = 'home.html';  // Redirect to home page on successful login
    })
    .catch((error) => {
      console.error("Login error:", error);
      displayErrorMessage('loginError', "Login failed: " + error.message);
    });
});

// Signup Form Submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  clearErrorMessages();
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    displayErrorMessage('signupError', "Passwords do not match!");
    return;
  }

auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    console.log("User logged in:", userCredential.user);
    window.location.href = 'home.html';  // Redirect to home page on successful login
  })
  .catch((error) => {
    console.error("Login error:", error);
    if (error.code === 'auth/invalid-email') {
      displayErrorMessage('loginError', "Invalid email format.");
    } else if (error.code === 'auth/user-disabled') {
      displayErrorMessage('loginError', "User account has been disabled.");
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      displayErrorMessage('loginError', "Invalid login credentials. Please check your email and password.");
    } else {
      displayErrorMessage('loginError', "Login failed: " + error.message);
    }
  });

});

// Social Login - Google
document.querySelectorAll('.social-btn')[0].addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      console.log("Google login successful:", result.user);
      window.location.href = 'home.html';  // Redirect to home page on successful login
    })
    .catch((error) => {
      console.error("Google login error:", error);
      displayErrorMessage('loginError', "Google login failed: " + error.message);
    });
});

// Social Login - Facebook
document.querySelectorAll('.social-btn')[1].addEventListener('click', () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      console.log("Facebook login successful:", result.user);
      window.location.href = 'home.html';  // Redirect to home page on successful login
    })
    .catch((error) => {
      console.error("Facebook login error:", error);
      displayErrorMessage('loginError', "Facebook login failed: " + error.message);
    });
});
