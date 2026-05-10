let balance = 200;
let followers = 0;
let promoWait = false; // Змінна для очікування промо

const streamers = [
  { name: "DK", img: "https://i.pinimg.com/originals/9a/ef/03/9aef0346beeb0b1ccb72c63b6f1600ee.png", rarity: "RARE", chance: 50, price: 15, fMin: 100, fMax: 500 },
  { name: "5opka", img: "https://static-cdn.jtvnw.net/jtv_user_pictures/e70b3a04-a290-43e5-854f-96a495a2a330-profile_image-300x300.png", rarity: "SUPER-RARE", chance: 25, price: 40, fMin: 500, fMax: 2000 },
  { name: "Drake", img: "https://static-cdn.jtvnw.net/jtv_user_pictures/1d8995c2-0c09-4422-9281-adba8b9461fb-profile_image-300x300.png", rarity: "EPIC", chance: 15, price: 100, fMin: 2000, fMax: 10000 },
  { name: "T2X2", img: "https://static-cdn.jtvnw.net/jtv_user_pictures/c3279fd1-6f68-4f40-bb7a-c358a6f7a492-profile_image-300x300.png", rarity: "MYTHIC", chance: 7, price: 250, fMin: 10000, fMax: 50000 },
  { name: "MZLF", img: "https://papik.pro/uploads/posts/2022-08/1661903000_2-papik-pro-p-mazelov-smailik-png-2.png", rarity: "LEGENDARY", chance: 2.5, price: 700, fMin: 50000, fMax: 200000 },
  { name: "Stint", img: "https://static-cdn.jtvnw.net/jtv_user_pictures/1fdc84cb-9f9d-48a3-b84f-b5944d76cb82-profile_image-300x300.png", rarity: "ULTRA-LEGENDARY", chance: 0.5, price: 3000, fMin: 500000, fMax: 1000000 }
];

// Логіка промокоду
document.getElementById('promo-btn').onclick = () => {
  const code = document.getElementById('promo-input').value.trim().toUpperCase();
  const status = document.getElementById('promo-status');
  if (code === "STINT") {
    promoWait = true;
    status.innerText = "PROMO ACTIVATED: NEXT SPIN IS STINT!";
    status.style.color = "#ff00ff";
  } else {
    status.innerText = "INVALID CODE";
    status.style.color = "red";
  }
};

function getDrop(isWinningSlot = false) {
  // Якщо це виграшний слот і активовано промо
  if (isWinningSlot && promoWait) {
    promoWait = false; // Вимикаємо після використання
    return streamers[5]; 
  }
  
  let rand = Math.random() * 100;
  let curr = 0;
  for (let s of streamers) {
    curr += s.chance;
    if (rand < curr) return s;
  }
  return streamers[0];
}

document.getElementById('profile-trigger').onclick = () => document.getElementById('profile-overlay').style.display = 'flex';
document.getElementById('close-profile').onclick = () => document.getElementById('profile-overlay').style.display = 'none';

document.getElementById('open-btn').onclick = () => {
  if (balance < 100) return alert("Not enough balance!");
  balance -= 100;
  document.getElementById('money').innerText = balance;
  document.getElementById('open-btn').disabled = true;
  document.getElementById('promo-status').innerText = "";

  const strip = document.getElementById('roulette-strip');
  strip.innerHTML = '';
  strip.style.transition = 'none';
  strip.style.transform = 'translateX(0)';

  const winIdx = 40; // Індекс предмета, який виграє
  let winItem = null;

  // Генеруємо стрічку
  for (let i = 0; i < 50; i++) {
    const item = getDrop(i === winIdx); // Тільки слот #40 перевіряє промокод
    if (i === winIdx) winItem = item;

    const div = document.createElement('div');
    div.className = `item`;
    div.innerHTML = `<img src="${item.img}">`;
    strip.appendChild(div);
  }

  setTimeout(() => {
    strip.style.transition = 'transform 4s cubic-bezier(0.1, 0, 0.1, 1)';
    const itemWidth = 140; 
    const wrapperWidth = document.querySelector('.roulette-wrapper').offsetWidth;
    const scrollPos = (winIdx * itemWidth) - (wrapperWidth / 2) + (itemWidth / 2);
    strip.style.transform = `translateX(-${scrollPos}px)`;
  }, 50);

  setTimeout(() => {
    showDrop(winItem);
    document.getElementById('open-btn').disabled = false;
  }, 4500);
};

function showDrop(item) {
  const overlay = document.getElementById('drop-overlay');
  const gain = Math.floor(Math.random() * (item.fMax - item.fMin)) + item.fMin;

  document.getElementById('drop-img').src = item.img;
  document.getElementById('drop-name-big').innerText = item.name;
  document.getElementById('rarity-text').innerText = item.rarity;
  document.getElementById('rarity-text').className = `text-${item.rarity}`;
  document.getElementById('follower-gain').innerText = `+${gain.toLocaleString()} Followers`;

  overlay.style.display = 'flex';
  followers += gain;
  document.getElementById('total-followers').innerText = followers.toLocaleString();
  
  addToInventory(item);
}

function addToInventory(item) {
  const inv = document.getElementById('inventory');
  const card = document.createElement('div');
  card.className = `inv-card`;
  card.style.borderBottom = `4px solid ${getRarityColor(item.rarity)}`;
  card.innerHTML = `
    <button class="fav-star">★</button>
    <img src="${item.img}">
    <div style="font-size:14px; margin-top:5px">$${item.price}</div>
  `;

  card.querySelector('.fav-star').onclick = (e) => {
    e.stopPropagation();
    document.querySelectorAll('.fav-star').forEach(s => s.classList.remove('active'));
    e.target.classList.add('active');
    const favDisp = document.getElementById('fav-display');
    favDisp.innerText = item.name;
    favDisp.style.color = getRarityColor(item.rarity);
  };

  card.onclick = () => {
    balance += item.price;
    document.getElementById('money').innerText = balance;
    card.remove();
  };

  inv.prepend(card);
}

function getRarityColor(rarity) {
  const colors = { 'RARE': '#2ecc71', 'SUPER-RARE': '#3498db', 'EPIC': '#9c88ff', 'MYTHIC': '#e84118', 'LEGENDARY': '#fbc531', 'ULTRA-LEGENDARY': '#ff00ff' };
  return colors[rarity] || 'white';
}

document.getElementById('drop-overlay').onclick = () => {
  document.getElementById('drop-overlay').style.display = 'none';
};
