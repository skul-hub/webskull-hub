// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAcZEqB3krDoB0oyBGAXjD2xB9fpFcw9LE",
  authDomain: "skull-project-67662.firebaseapp.com",
  projectId: "skull-project-67662",
  storageBucket: "skull-project-67662.firebasestorage.app",
  messagingSenderId: "94784709981",
  appId: "1:94784709981:web:8cb540df8cbe5429a034b4"
};

// 🔹 Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 🔹 Firestore & Auth
const db = firebase.firestore();
const auth = firebase.auth();

// 🔹 Optional: listener status login (realtime)
auth.onAuthStateChanged(user => {
  if(user){
    console.log("User logged in:", user.uid);
  } else {
    console.log("No user logged in");
  }
});

// 🔹 Function: check admin login
function isAdminLogin(username, password){
  return username === "admin" && password === "admin112233";
}

// 🔹 Function: register user
function registerUser(username, email, password){
  return auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential=>{
      const user = userCredential.user;
      // Simpan data user di Firestore
      return db.collection("users").doc(user.uid).set({
        username: username,
        role: "user",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
}

// 🔹 Function: login user
function loginUser(email, password){
  return auth.signInWithEmailAndPassword(email, password);
}

// 🔹 Function: logout
function logout(){
  return auth.signOut();
}
