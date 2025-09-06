const user = auth.currentUser;
let cart = [];

// Logout
document.getElementById("logout").addEventListener("click", ()=>auth.signOut().then(()=>window.location.href="index.html"));

// Navbar switch
document.getElementById("nav-beranda").addEventListener("click",()=>showSection("beranda"));
document.getElementById("nav-keranjang").addEventListener("click",()=>showSection("keranjang"));
document.getElementById("nav-history").addEventListener("click",()=>showSection("history"));

function showSection(sec){
  document.getElementById("beranda").style.display="none";
  document.getElementById("keranjang").style.display="none";
  document.getElementById("history").style.display="none";
  document.getElementById(sec).style.display="block";
}

// Realtime products
db.collection("products").onSnapshot(snapshot=>{
  const container = document.getElementById("products-container");
  container.innerHTML="";
  snapshot.forEach(doc=>{
    const data = doc.data();
    const card = document.createElement("div");
    card.className="product-card";
    card.innerHTML=`
      <img src="${data.imageURL}" alt="${data.name}">
      <h3>${data.name}</h3>
      <p>Rp${data.price}</p>
      <button onclick="buyProduct('${doc.id}','${data.name}','${data.price}')">BUY</button>
      <button onclick="addToCart('${doc.id}','${data.name}','${data.price}')">Tambah ke Keranjang</button>
    `;
    container.appendChild(card);
  });
});

// Announcement realtime
db.collection("announcements").orderBy("createdAt","desc")
  .onSnapshot(snapshot=>{
    const ann = document.getElementById("announcements");
    ann.innerHTML="";
    snapshot.forEach(doc=>{
      ann.innerHTML+=`<p>${doc.data().message}</p>`;
    });
  });

// Buy product
function buyProduct(id,name,price){
  const buyerName = prompt("Masukkan nama anda");
  const phone = prompt("Masukkan nomor WA");
  const telegram = prompt("Masukkan Telegram (opsional)");

  db.collection("orders").add({
    userId: auth.currentUser.uid,
    items: [{productId:id,name:name,qty:1,price:price}],
    buyerName: buyerName,
    phone: phone,
    telegram: telegram,
    status: "pending",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  alert("Pesanan terkirim ke admin!");
}

// Keranjang
function addToCart(id,name,price){
  cart.push({productId:id,name:name,qty:1,price:price});
  alert("Produk ditambahkan ke keranjang!");
}

// Checkout
document.getElementById("checkout-btn").addEventListener("click", ()=>{
  if(cart.length==0) return alert("Keranjang kosong!");
  const buyerName = prompt("Masukkan nama anda");
  const phone = prompt("Masukkan nomor WA");
  const telegram = prompt("Masukkan Telegram (opsional)");
  db.collection("orders").add({
    userId: auth.currentUser.uid,
    items: cart,
    buyerName,
    phone,
    telegram,
    status:"pending",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  cart=[];
  alert("Checkout berhasil!");
});

// History realtime
db.collection("orders").where("userId","==",auth.currentUser?.uid)
  .orderBy("createdAt","desc")
  .onSnapshot(snapshot=>{
    const historyDiv = document.getElementById("history-items");
    historyDiv.innerHTML="";
    snapshot.forEach(doc=>{
      const data = doc.data();
      historyDiv.innerHTML+=`
        <div class="history-card">
          <p>Nama Barang: ${data.items.map(i=>i.name).join(", ")}</p>
          <p>Qty: ${data.items.map(i=>i.qty).join(", ")}</p>
          <p>Status: ${data.status}</p>
        </div>
      `;
    });
  });
