const loginForm=document.getElementById("login-form");
const registerForm=document.getElementById("register-form");
const showRegister=document.getElementById("show-register");
const showLogin=document.getElementById("show-login");

showRegister.addEventListener("click",e=>{e.preventDefault();loginForm.style.display="none";registerForm.style.display="block";});
showLogin.addEventListener("click",e=>{e.preventDefault();registerForm.style.display="none";loginForm.style.display="block";});

document.getElementById("login-btn").addEventListener("click",async ()=>{
  const username=document.getElementById("login-username").value;
  const password=document.getElementById("login-password").value;
  if(isAdminLogin(username,password)){alert("Login admin berhasil!");window.location.href="admin.html";return;}
  try{await loginUser(username,password);alert("Login user berhasil!");window.location.href="user.html";}catch(err){alert(err.message);}
});

document.getElementById("register-btn").addEventListener("click",async ()=>{
  const username=document.getElementById("register-username").value;
  const email=document.getElementById("register-email").value;
  const password=document.getElementById("register-password").value;
  try{await registerUser(username,email,password);alert("Registrasi berhasil! Silakan login");registerForm.reset();loginForm.style.display="block";registerForm.style.display="none";}catch(err){alert(err.message);}
});
