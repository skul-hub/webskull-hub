const firebaseConfig = {
  apiKey: "AIzaSyAcZEqB3krDoB0oyBGAXjD2xB9fpFcw9LE",
  authDomain: "skull-project-67662.firebaseapp.com",
  projectId: "skull-project-67662",
  storageBucket: "skull-project-67662.firebasestorage.app",
  messagingSenderId: "94784709981",
  appId: "1:94784709981:web:8cb540df8cbe5429a034b4"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

function isAdminLogin(username,password){return username==="admin" && password==="admin112233";}

function registerUser(username,email,password){
  return auth.createUserWithEmailAndPassword(email,password)
    .then(userCredential=>{
      const user=userCredential.user;
      return db.collection("users").doc(user.uid).set({
        username:username,email:email,role:"user",
        createdAt:firebase.firestore.FieldValue.serverTimestamp()
      });
    });
}

function loginUser(username,password){
  return db.collection("users").where("username","==",username).get()
    .then(snapshot=>{
      if(snapshot.empty) throw new Error("Username tidak ditemukan");
      const email=snapshot.docs[0].data().email;
      return auth.signInWithEmailAndPassword(email,password);
    });
}

function logout(){return auth.signOut();}
