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

// --- Admin Dashboard ---
// Tambah produk
async function addProduct(name,price,imageURL){
  await db.collection("products").add({
    name: name,
    price: Number(price),
    imageURL: imageURL,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  alert("Produk berhasil ditambahkan!");
}

// Update produk
async function updateProduct(docId,name,price,imageURL){
  await db.collection("products").doc(docId).update({
    name: name,
    price: Number(price),
    imageURL: imageURL
  });
  alert("Produk berhasil diupdate!");
}

// Hapus produk
async function deleteProduct(docId){
  await db.collection("products").doc(docId).delete();
  alert("Produk berhasil dihapus!");
}

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
db.collection("orders").orderBy("createdAt","desc")
  .onSnapshot(snapshot=>{
    const pendingTable = document.getElementById("pending-orders");
    pendingTable.innerHTML = "";
    snapshot.forEach(doc=>{
      const data = doc.data();
      if(data.status === "pending"){
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${data.username}</td>
          <td>${data.items.map(i=>i.name+" x"+i.qty).join(", ")}</td>
          <td>${data.total}</td>
          <td>
            <button onclick="setOrderStatus('${doc.id}','done')">Done</button>
            <button onclick="setOrderStatus('${doc.id}','batal')">Batal</button>
          </td>
        `;
        pendingTable.appendChild(row);
      }
    });
  });

// Ubah status order
async function setOrderStatus(docId,status){
  await db.collection("orders").doc(docId).update({
    status: status
  });
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
