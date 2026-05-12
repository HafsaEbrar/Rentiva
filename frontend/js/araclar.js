let tumAraclar = [];
let filtreliAraclar = [];
let mevcutSayfa = 1;
const sayfaBasinaArac = 9;

// ===== SAYFA YÜKLENİNCE =====
window.onload = () => {
  araclariGetir();
};

async function araclariGetir() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8100/api/vehicles", {
      headers: token ? { Authorization: "Bearer " + token } : {},
    });
    const data = await response.json();

    if (response.ok) {
      tumAraclar = data;
      filtreliAraclar = [...tumAraclar];
      araclariGoster();
    } else {
      document.getElementById("aracGrid").innerHTML =
        '<div class="yukleniyor">Araçlar yüklenemedi.</div>';
    }
  } catch (error) {
    console.error(error);
    document.getElementById("aracGrid").innerHTML =
      '<div class="yukleniyor">Sunucuya bağlanılamadı.</div>';
  }
}

// ===== ARAÇLARI GÖSTER =====
function araclariGoster() {
  const grid = document.getElementById("aracGrid");
  const baslangic = (mevcutSayfa - 1) * sayfaBasinaArac;
  const bitis = baslangic + sayfaBasinaArac;
  const sayfadakiler = filtreliAraclar.slice(baslangic, bitis);

  const sayiEl = document.getElementById("aracSayisi");
  sayiEl.innerHTML = `Toplam <strong>${filtreliAraclar.length}</strong> araç bulundu`;

  if (sayfadakiler.length === 0) {
    grid.innerHTML =
      '<div class="yukleniyor">Filtreye uygun araç bulunamadı.</div>';
    paginationGoster();
    return;
  }

  grid.innerHTML = sayfadakiler.map((arac) => kartHTML(arac)).join("");
  paginationGoster();
}

// ===== KART HTML =====
function kartHTML(arac) {

  const gorsel = arac.imageUrl
    ? `<img src="http://127.0.0.1:5500/${arac.imageUrl}"
            alt="${arac.plateNo || "Araç"}">`
    : `<div class="no-image">🚗</div>`;

  const yilBadge = arac.year
    ? `<div class="kart-yil-badge">${arac.year}</div>`
    : "";

  // ===== MODEL BİLGİLERİ =====

  const marka =
    arac.model?.brand || "";

  const model =
    arac.model?.modelName || "";

  const yakit =
    arac.model?.fuelType || "";

  const vites =
    arac.model?.transmissionType || "";

  const kategori =
    arac.model?.category?.name || "";

  // ===== CHIPS =====

  const chiplar = [];

  if (arac.hasAirConditioning) {
    chiplar.push(`
      <span class="detay-chip">
        ❄️ Klima
      </span>
    `);
  }

  if (kategori) {
    chiplar.push(`
      <span class="detay-chip">
        🚘 ${kategori}
      </span>
    `);
  }

  if (yakit) {
    chiplar.push(`
      <span class="detay-chip">
        ⛽ ${yakit}
      </span>
    `);
  }

  if (vites) {
    chiplar.push(`
      <span class="detay-chip">
        ⚙️ ${vites}
      </span>
    `);
  }

  // ===== FİYAT =====

  const fiyat = arac.dailyPrice
    ? `₺${Number(arac.dailyPrice)
        .toLocaleString("tr-TR")}`
    : "-";

  // ===== HTML =====

  return `
    <div class="arac-kart">

      <div class="kart-gorsel">

        ${gorsel}

        ${yilBadge}

        <button class="favori-btn"
                title="Favorilere ekle">

          🤍

        </button>

      </div>

      <div class="kart-icerik">

        <div class="kart-baslik">

          ${marka} ${model}

        </div>

        <div class="kart-plaka">

          ${arac.plateNo || "-"}

        </div>

        <div class="kart-detaylar">

          ${chiplar.join("")}

        </div>

        <div class="kart-alt">

          <div class="kart-fiyat">

            ${fiyat}
            <span>/gün</span>

          </div>

          <a href="detay.html?id=${arac.id}"
             class="btn-detay">

            İncele &rsaquo;

          </a>

        </div>

      </div>

    </div>
  `;
}

// ===== FİLTRELE =====
function filtrele() {
  const maxFiyat = parseInt(document.getElementById("maxFiyatRange").value);
  const minYil = document.getElementById("minYil").value;
  const maxYil = document.getElementById("maxYil").value;

  // Dropdown değerleri
  const seciliMarka = document.getElementById("aracMarkasi").value;
  const seciliVites = document.getElementById("vitesTipi").value;
  const seciliYakit = document.getElementById("yakitTipi").value;
  const seciliTip = document.getElementById("aracTipi").value;

  filtreliAraclar = tumAraclar.filter((arac) => {
    // Fiyat filtresi
    if (arac.dailyPrice && arac.dailyPrice > maxFiyat) return false;

    // Yıl filtresi
    if (minYil && arac.year < parseInt(minYil)) return false;
    if (maxYil && arac.year > parseInt(maxYil)) return false;

   // ✅ DOĞRU - nested model üzerinden erişim
    if (seciliMarka && arac.model?.brand !== seciliMarka) return false;
    if (seciliVites && arac.model?.transmissionType !== seciliVites) return false;
    if (seciliYakit && arac.model?.fuelType !== seciliYakit) return false;
    if (seciliTip && arac.model?.category?.name !== seciliTip) return false;

    // Araç tipi filtresi
    if (seciliTip && arac.vehicleType !== seciliTip) return false;

    return true;
  });

  mevcutSayfa = 1;
  araclariGoster();
}

// ===== SIRALA =====
function sirala() {
  const siralama = document.getElementById("siralama").value;

  if (siralama === "fiyat-asc") {
    filtreliAraclar.sort((a, b) => (a.dailyPrice || 0) - (b.dailyPrice || 0));
  } else if (siralama === "fiyat-desc") {
    filtreliAraclar.sort((a, b) => (b.dailyPrice || 0) - (a.dailyPrice || 0));
  } else if (siralama === "yil-desc") {
    filtreliAraclar.sort((a, b) => (b.year || 0) - (a.year || 0));
  }

  mevcutSayfa = 1;
  araclariGoster();
}

// ===== FİLTRE TEMİZLE =====
function temizleFiltre() {
  document.getElementById("maxFiyatRange").value = 10000;
  document.getElementById("minYil").value = "";
  document.getElementById("maxYil").value = "";
  document.getElementById("maxFiyat").textContent = "₺10.000+";
  document.getElementById("aracMarkasi").value = "";
  document.getElementById("vitesTipi").value = "";
  document.getElementById("yakitTipi").value = "";
  document.getElementById("aracTipi").value = "";

  const baslangicEl = document.getElementById("baslangicTarih");
  const bitisEl = document.getElementById("bitisTarih");
  if (baslangicEl) baslangicEl.value = "";
  if (bitisEl) bitisEl.value = "";

  filtreliAraclar = [...tumAraclar];
  mevcutSayfa = 1;
  araclariGoster();
}

// ===== FİYAT RANGE =====
function updateFiyat(value) {
  document.getElementById("maxFiyat").textContent =
    value >= 10000 ? "₺10.000+" : `₺${Number(value).toLocaleString("tr-TR")}`;
  filtrele();
}

// ===== VIEW MOD =====
function setView(mod) {
  const grid = document.getElementById("aracGrid");
  document
    .querySelectorAll(".view-btn")
    .forEach((b) => b.classList.remove("active"));

  if (mod === "list") {
    grid.classList.add("list-view");
    document.querySelectorAll(".view-btn")[1].classList.add("active");
  } else {
    grid.classList.remove("list-view");
    document.querySelectorAll(".view-btn")[0].classList.add("active");
  }
}

// ===== PAGİNATION =====
function paginationGoster() {
  const toplam = Math.ceil(filtreliAraclar.length / sayfaBasinaArac);
  const pagination = document.getElementById("pagination");

  if (toplam <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = `<button class="page-btn" onclick="sayfaDegistir(${mevcutSayfa - 1})" ${mevcutSayfa === 1 ? "disabled" : ""}>‹</button>`;

  for (let i = 1; i <= toplam; i++) {
    if (i === 1 || i === toplam || Math.abs(i - mevcutSayfa) <= 1) {
      html += `<button class="page-btn ${i === mevcutSayfa ? "active" : ""}" onclick="sayfaDegistir(${i})">${i}</button>`;
    } else if (Math.abs(i - mevcutSayfa) === 2) {
      html += `<button class="page-btn" disabled>…</button>`;
    }
  }

  html += `<button class="page-btn" onclick="sayfaDegistir(${mevcutSayfa + 1})" ${mevcutSayfa === toplam ? "disabled" : ""}>›</button>`;
  pagination.innerHTML = html;
}

function sayfaDegistir(sayfa) {
  const toplam = Math.ceil(filtreliAraclar.length / sayfaBasinaArac);
  if (sayfa < 1 || sayfa > toplam) return;
  mevcutSayfa = sayfa;
  araclariGoster();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
// ===== AUTH BUTTON =====

function authKontrol() {
  const authButtons = document.getElementById("authButtons");

  const token = localStorage.getItem("token");

  if (token) {
    authButtons.innerHTML = `
      <button type="button" onclick="logout()" class="btn-solid">
        Çıkış Yap
      </button>
    `;
  } else {
    authButtons.innerHTML = `
      <a href="login.html" class="btn-solid">
        Giriş Yap / Kayıt Ol
      </a>
    `;
  }
}

window.logout = function () {
  localStorage.removeItem("token");

  alert("Çıkış yapıldı");

  window.location.href = "login.html";
};
