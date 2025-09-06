// Firebase Config (ganti sesuai projectmu)
const firebaseConfig = {
  apiKey: "AIzaSyAcZEqB3krDoB0oyBGAXjD2xB9fpFcw9LE",
  authDomain: "skull-project-67662.firebaseapp.com",
  projectId: "skull-project-67662",
  storageBucket: "skull-project-67662.firebasestorage.app",
  messagingSenderId: "94784709981",
  appId: "1:94784709981:web:8cb540df8cbe5429a034b4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
