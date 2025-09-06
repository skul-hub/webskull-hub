const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegister = document.getElementById("show-register");

// Toggle register form
showRegister.addEventListener("click", e => {
  e.preventDefault();
  loginForm.style.display = "none";
  registerForm.style.display = "block";
});

// Register user
registerForm.addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("reg-username").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      db.collection("users").doc(user.uid).set({
        username: username,
        role: "user",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert("Registrasi berhasil!");
      registerForm.reset();
      registerForm.style.display = "none";
      loginForm.style.display = "block";
    })
    .catch(err => alert(err.message));
});

// Login user/admin
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // cek admin
  if(username === "admin" && password === "admin112233"){
    alert("Login admin berhasil");
    window.location.href = "admin.html";
  } else {
    // login user via email
    db.collection("users").where("username", "==", username).get()
      .then(snapshot => {
        if(snapshot.empty){
          alert("User tidak ditemukan!");
        } else {
          const userData = snapshot.docs[0].data();
          const email = snapshot.docs[0].data().email;
          auth.signInWithEmailAndPassword(email, password)
            .then(()=> {
              alert("Login user berhasil!");
              window.location.href = "user.html";
            })
            .catch(err=>alert(err.message));
        }
      });
  }
});
