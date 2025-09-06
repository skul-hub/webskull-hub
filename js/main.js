// Example login form
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

loginForm.addEventListener("submit", async e=>{
  e.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;

  // cek admin dulu
  if(isAdminLogin(username,password)){
    alert("Login admin berhasil!");
    window.location.href = "admin.html";
    return;
  }

  // user login
  try{
    await loginUser(username,password);
    alert("Login user berhasil!");
    window.location.href = "user.html";
  } catch(err){
    alert(err.message);
  }
});

// register form
registerForm.addEventListener("submit", async e=>{
  e.preventDefault();
  const username = registerForm.username.value;
  const email = registerForm.email.value;
  const password = registerForm.password.value;

  try{
    await registerUser(username,email,password);
    alert("Registrasi berhasil! Silakan login");
    registerForm.reset();
  } catch(err){
    alert(err.message);
  }
});
