document.addEventListener("DOMContentLoaded",()=>{

const productContainer=document.getElementById("product-container");
const announcementContainer=document.getElementById("announcement");
const cartContainer=document.getElementById("cart-container");
const cartTotal=document.getElementById("cart-total");
const historyContainer=document.getElementById("history-container");
let cart=[];

// ==== Produk realtime ====
db.collection("products").orderBy("createdAt","desc").onSnapshot(snapshot=>{
  productContainer.innerHTML="";
  snapshot.forEach(doc=>{
    const data=doc.data();
    const card=document.createElement("div");
    card.className="product-card";
    card.innerHTML=`
      <img src="${data.imageURL}" />
      <h3>${data.name}</h3>
      <p>Rp ${data.price}</p>
      <button onclick="buyProduct('${doc.id}','${data.name}',${data.price})">Buy</button>
      <button onclick="addToCart('${doc.id}','${data.name}',${data.price})">Keranjang</button>
    `;
    productContainer.appendChild(card);
  });
});

// ==== Announcement realtime ====
db.collection("announcement").orderBy("createdAt","desc").onSnapshot(snapshot=>{
  announcementContainer.innerHTML="";
  snapshot.forEach(doc=>{
    const data=doc.data();
    const p=document.createElement("p");
    p.textContent=data.text;
    announcementContainer.appendChild(p);
  });
});

// ==== History realtime ====
auth.onAuthStateChanged(user=>{
  if(user){
    db.collection("orders").where("uid","==",user.uid).orderBy("createdAt","desc")
      .onSnapshot(snapshot=>{
        historyContainer.innerHTML="";
        snapshot.forEach(doc=>{
          const data=doc.data();
          const div=document.createElement("div");
          div.innerHTML=`
            <p>Status: ${data.status}</p>
            <p>Items: ${data.items.map(i=>i.name+" x"+i.qty).join(", ")}</p>
            <p>Total: Rp ${data.total}</p>
          `;
          historyContainer.appendChild(div);
        });
      });
  }
});

// ==== Keranjang ====
window.addToCart=(id,name,price)=>{
  const existing=cart.find(i=>i.id===id);
  if(existing) existing.qty++;
  else cart.push({id,name,price,qty:1});
  renderCart();
};

function renderCart(){
  cartContainer.innerHTML="";
  let total=0;
  cart.forEach(i=>{
    const div=document.createElement("div");
    div.textContent=`${i.name} x ${i.qty} = Rp ${i.price*i.qty}`;
    cartContainer.appendChild(div);
    total+=i.price*i.qty;
  });
  cartTotal.textContent=total;
}

// ==== Buy langsung ====
window.buyProduct=(id,name,price)=>{
  const username=prompt("Masukkan Nama:");
  const phone=prompt("Masukkan Nomor WA:");
  const telegram=prompt("Masukkan Username Telegram (opsional):");
  if(!username || !phone) return alert("Nama dan WA wajib!");
  const items=[{id,name,price,qty:1}];
  const total=price;
  const user=auth.currentUser;
  db.collection("orders").add({
    uid:user.uid,username,phone,telegram,items,total,status:"pending",
    createdAt:firebase.firestore.FieldValue.serverTimestamp()
  }).then(()=>alert("Pesanan dikirim ke admin!"));
};

// ==== Checkout dari keranjang ====
window.checkoutPrompt=()=>{
  if(cart.length===0) return alert("Keranjang kosong!");
  const username=prompt("Masukkan Nama:");
  const phone=prompt("Masukkan Nomor WA:");
  const telegram=prompt("Masukkan Username Telegram (opsional):");
  if(!username || !phone) return alert("Nama dan WA wajib!");
  const total=cart.reduce((acc,i)=>acc+i.price*i.qty,0);
  const user=auth.currentUser;
  const items=cart.map(i=>({id:i.id,name:i.name,price:i.price,qty:i.qty}));
  db.collection("orders").add({
    uid:user.uid,username,phone,telegram,items,total,status:"pending",
    createdAt:firebase.firestore.FieldValue.serverTimestamp()
  }).then(()=>{
    cart=[];renderCart();alert("Checkout berhasil! Admin akan menghubungi kamu.");
  });
};

// ==== Logout ====
window.logout=()=>auth.signOut().then(()=>window.location.href="index.html");

});
