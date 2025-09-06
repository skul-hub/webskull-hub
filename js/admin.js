// Logout admin
document.getElementById("admin-logout").addEventListener("click", ()=>{
  window.location.href="index.html";
});

// Navbar switch
document.getElementById("nav-admin-beranda").addEventListener("click",()=>showAdminSection("admin-beranda"));
document.getElementById("nav-kelola-produk").addEventListener("click",()=>showAdminSection("kelola-produk"));
document.getElementById("nav-kelola-pesanan").addEventListener("click",()=>showAdminSection("kelola-pesanan"));
document.getElementById("nav-announcement").addEventListener("click",()=>showAdminSection("announcement-section"));

function showAdminSection(sec){
  document.getElementById("admin-beranda").style.display="none";
  document.getElementById("kelola-produk").style.display="none";
  document.getElementById("kelola-pesanan").style.display="none";
  document.getElementById("announcement-section").style.display="none";
  document.getElementById(sec).style.display="block";
}

// Tambah produk
document.getElementById("add-product-form").addEventListener("submit", e=>{
  e.preventDefault();
  const name = document.getElementById("product-name").value;
  const price = document.getElementById("product-price").value;
  const image = document.getElementById("product-image").value;

  db.collection("products").add({
    name, price, imageURL:image,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  e.target.reset();
  alert("Produk berhasil ditambahkan!");
});

// Tabel produk realtime
db.collection("products").onSnapshot(snapshot=>{
  const container = document.getElementById("products-table");
  container.innerHTML="<table><tr><th>Nama</th><th>Harga</th><th>Gambar</th><th>Aksi</th></tr>";
  snapshot.forEach(doc=>{
    const data = doc.data();
    const row = document.createElement("tr");
    row.innerHTML=`
      <td>${data.name}</td>
      <td>${data.price}</td>
      <td><img src="${data.imageURL}" width="50"></td>
      <td>
        <button onclick="deleteProduct('${doc.id}')">Hapus</button>
      </td>
    `;
    container.appendChild(row);
  });
  container.innerHTML+="</table>";
});

function deleteProduct(id){
  if(confirm("Hapus produk ini?")){
    db.collection("products").doc(id).delete();
  }
}

// Kelola Pesanan realtime
function renderOrders(){
  db.collection("orders").orderBy("createdAt","desc").onSnapshot(snapshot=>{
    const pending = document.getElementById("pending-orders");
    const done = document.getElementById("done-orders");
    const batal = document.getElementById("batal-orders");
    pending.innerHTML=""; done.innerHTML=""; batal.innerHTML="";

    snapshot.forEach(doc=>{
      const data = doc.data();
      const card = document.createElement("div");
      card.className="order-card";
      card.innerHTML=`
        <p>Nama: ${data.buyerName}</p>
        <p>Barang: ${data.items.map(i=>i.name).join(", ")}</p>
        <p>Qty: ${data.items.map(i=>i.qty).join(", ")}</p>
        <p>WA: ${data.phone}</p>
        <p>Telegram: ${data.telegram || "-"}</p>
      `;
      if(data.status==="pending"){
        const doneBtn=document.createElement("button");
        doneBtn.textContent="Done";
        doneBtn.onclick=()=>updateOrderStatus(doc.id,"done");
        const batalBtn=document.createElement("button");
        batalBtn.textContent="Batal";
        batalBtn.onclick=()=>updateOrderStatus(doc.id,"batal");
        card.appendChild(doneBtn);
        card.appendChild(batalBtn);
        pending.appendChild(card);
      } else if(data.status==="done"){
        done.appendChild(card);
      } else if(data.status==="batal"){
        batal.appendChild(card);
      }
    });
  });
}

function updateOrderStatus(id,status){
  db.collection("orders").doc(id).update({status});
}

// Announcement
document.getElementById("announcement-form").addEventListener("submit", e=>{
  e.preventDefault();
  const msg = document.getElementById("announcement-input").value;
  db.collection("announcements").add({
    message: msg,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  e.target.reset();
});

// Realtime announcement list
db.collection("announcements").orderBy("createdAt","desc").onSnapshot(snapshot=>{
  const annList = document.getElementById("announcement-list");
  annList.innerHTML="";
  snapshot.forEach(doc=>{
    annList.innerHTML+=`<p>${doc.data().message}</p>`;
  });
});

// Jalankan render orders
renderOrders();
