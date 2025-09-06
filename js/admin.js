document.addEventListener("DOMContentLoaded",()=>{

const productList = document.getElementById("product-list");
const pendingOrders = document.getElementById("pending-orders");
const doneOrders = document.getElementById("done-orders");
const batalOrders = document.getElementById("batal-orders");
const announcementInput = document.getElementById("announcement-input");

// ==== Produk ====
window.addProductPrompt=()=>{
  const name = document.getElementById("product-name").value;
  const price = parseInt(document.getElementById("product-price").value);
  const imageURL = document.getElementById("product-image").value;
  if(!name || !price || !imageURL) return alert("Isi semua field produk!");
  db.collection("products").add({
    name, price, imageURL,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(()=>{
    document.getElementById("product-name").value="";
    document.getElementById("product-price").value="";
    document.getElementById("product-image").value="";
  });
};

// Render product list realtime
db.collection("products").orderBy("createdAt","desc").onSnapshot(snapshot=>{
  productList.innerHTML="";
  snapshot.forEach(doc=>{
    const data=doc.data();
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${data.name}</td><td>${data.price}</td><td><img src="${data.imageURL}" width="50"/></td>
      <td>
        <button onclick="editProduct('${doc.id}','${data.name}',${data.price},'${data.imageURL}')">Edit</button>
        <button onclick="deleteProduct('${doc.id}')">Hapus</button>
      </td>`;
    productList.appendChild(tr);
  });
});

window.editProduct=(id,name,price,imageURL)=>{
  const newName = prompt("Nama produk:",name);
  const newPrice = parseInt(prompt("Harga produk:",price));
  const newImage = prompt("URL Gambar:",imageURL);
  if(!newName || !newPrice || !newImage) return;
  db.collection("products").doc(id).update({
    name:newName, price:newPrice, imageURL:newImage
  });
};

window.deleteProduct=(id)=>{
  if(confirm("Hapus produk ini?")){
    db.collection("products").doc(id).delete();
  }
};

// ==== Pesanan ====
db.collection("orders").orderBy("createdAt","desc").onSnapshot(snapshot=>{
  pendingOrders.innerHTML="";
  doneOrders.innerHTML="";
  batalOrders.innerHTML="";
  snapshot.forEach(doc=>{
    const data=doc.data();
    const tr=document.createElement("tr");
    const itemsStr = data.items.map(i=>i.name+" x"+i.qty).join(", ");
    if(data.status==="pending"){
      tr.innerHTML=`<td>${data.username}</td><td>${itemsStr}</td><td>${data.total}</td>
        <td>
          <button onclick="updateOrderStatus('${doc.id}','done')">Done</button>
          <button onclick="updateOrderStatus('${doc.id}','batal')">Batal</button>
        </td>`;
      pendingOrders.appendChild(tr);
    } else if(data.status==="done"){
      tr.innerHTML=`<td>${data.username}</td><td>${itemsStr}</td><td>${data.total}</td>`;
      doneOrders.appendChild(tr);
    } else if(data.status==="batal"){
      tr.innerHTML=`<td>${data.username}</td><td>${itemsStr}</td><td>${data.total}</td>`;
      batalOrders.appendChild(tr);
    }
  });
});

window.updateOrderStatus=(id,status)=>{
  db.collection("orders").doc(id).update({status});
};

// ==== Announcement ====
window.addAnnouncement=()=>{
  const text = announcementInput.value.trim();
  if(!text) return alert("Isi announcement!");
  db.collection("announcement").add({
    text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(()=>announcementInput.value="");
};

// ==== Logout ====
window.logout=()=>auth.signOut().then(()=>window.location.href="index.html");

});
