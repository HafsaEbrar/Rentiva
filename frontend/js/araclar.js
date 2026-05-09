let tumAraclar = [];
let filtreliAraclar = [];
let mevcutSayfa = 1;
const sayfaBasinaArac = 8;
 
// ===== SAYFA YÜKLENİNCE =====
window.onload = () => {
  araclariGetir();
};
 

async function araclariGetir() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/api/vehicles', {
      headers: token ? { 'Authorization': 'Bearer ' + token } : {}
    });
    const data = await response.json();

    if (response.ok) {
      tumAraclar = data;
      filtreliAraclar = [...tumAraclar];
      araclariGoster();
    } else {
      document.getElementById('aracGrid').innerHTML = '<div class="yukleniyor">Araçlar yüklenemedi.</div>';
    }
  } catch (error) {
    console.error(error);
    document.getElementById('aracGrid').innerHTML = '<div class="yukleniyor">Sunucuya bağlanılamadı.</div>';
  }
}
 
// ===== ARAÇLARI GÖSTER =====
function araclariGoster() {
  const grid = document.getElementById('aracGrid');
  const baslangic = (mevcutSayfa - 1) * sayfaBasinaArac;
  const bitis = baslangic + sayfaBasinaArac;
  const sayfadakiler = filtreliAraclar.slice(baslangic, bitis);
 
  document.getElementById('aracSayisi').textContent = `Toplam ${filtreliAraclar.length} araç bulundu`;
 
  if (sayfadakiler.length === 0) {
    grid.innerHTML = '<div class="yukleniyor">Filtreye uygun araç bulunamadı.</div>';
    paginationGoster();
    return;
  }
 
  grid.innerHTML = sayfadakiler.map(arac => kartHTML(arac)).join('');
  paginationGoster();
}
 function kartHTML(arac) {
  return `
    <div class="arac-kart">
      <div class="kart-gorsel">
        ${arac.imageUrl 
      ? `<img src="http://127.0.0.1:5500/${arac.imageUrl}" alt="${arac.plateNo}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">` 
      : `<span class="no-image">🚗</span>`}

      </div>
      <div class="kart-icerik">
        <div class="kart-baslik">${arac.plateNo}</div>
        <div class="kart-bilgi">${arac.year ? arac.year : '-'} • ${arac.status ? arac.status : '-'}</div>
        <div class="kart-detaylar">
          <span>🅰️ ${arac.hasAirConditioning ? 'Klima var' : 'Klima yok'}</span>
        </div>
        <div class="kart-alt">
          <div class="kart-fiyat">
            ₺${arac.dailyPrice ? Number(arac.dailyPrice).toLocaleString('tr-TR') : '-'} <span>/gün</span>
          </div>
          <a href="arac-detay.html?id=${arac.id}" class="btn-detay">Detaylar</a>
        </div>
      </div>
    </div>
  `;
}
 
// ===== FİLTRELE =====
function filtrele() {
   console.log("filtre çalıştı");

  const maxFiyat =
    parseInt(document.getElementById('maxFiyatRange').value);

  const minYil =
    document.getElementById('minYil').value;

  const maxYil =
    document.getElementById('maxYil').value;

  filtreliAraclar = tumAraclar.filter(arac => {

    if (arac.dailyPrice > maxFiyat)
      return false;

    if (minYil && arac.year < parseInt(minYil))
      return false;

    if (maxYil && arac.year > parseInt(maxYil))
      return false;

    return true;
  });

  mevcutSayfa = 1;

  araclariGoster();
}
 
// ===== SIRALA =====
function sirala() {

  const siralama =
    document.getElementById('siralama').value;

  if (siralama === 'fiyat-asc') {

    filtreliAraclar.sort(
      (a, b) => a.dailyPrice - b.dailyPrice
    );

  }

  else if (siralama === 'fiyat-desc') {

    filtreliAraclar.sort(
      (a, b) => b.dailyPrice - a.dailyPrice
    );

  }

  else if (siralama === 'yil-desc') {

    filtreliAraclar.sort(
      (a, b) => b.year - a.year
    );
  }

  mevcutSayfa = 1;

  araclariGoster();
}
 
// ===== FİLTRE TEMİZLE =====
function temizleFiltre() {
  document.querySelectorAll('.filtre-item input[type=checkbox]').forEach(c => c.checked = false);
  document.getElementById('maxFiyatRange').value = 10000;
  document.getElementById('minYil').value = '';
  document.getElementById('maxYil').value = '';
  document.getElementById('maxFiyat').textContent = '₺10.000+';
 
  filtreliAraclar = [...tumAraclar];
  mevcutSayfa = 1;
  araclariGoster();
}
 
// ===== FİYAT RANGE =====
function updateFiyat(value) {
  document.getElementById('maxFiyat').textContent = value >= 10000 ? '₺10.000+' : `₺${Number(value).toLocaleString('tr-TR')}`;
  filtrele();
}
 
// ===== VIEW MOD =====
function setView(mod) {
  const grid = document.getElementById('aracGrid');
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
 
  if (mod === 'list') {
    grid.classList.add('list-view');
    document.querySelectorAll('.view-btn')[1].classList.add('active');
  } else {
    grid.classList.remove('list-view');
    document.querySelectorAll('.view-btn')[0].classList.add('active');
  }
}
 
// ===== PAGİNATION =====
function paginationGoster() {
  const toplam = Math.ceil(filtreliAraclar.length / sayfaBasinaArac);
  const pagination = document.getElementById('pagination');
 
  if (toplam <= 1) { pagination.innerHTML = ''; return; }
 
  let html = `<button class="page-btn" onclick="sayfaDegistir(${mevcutSayfa - 1})" ${mevcutSayfa === 1 ? 'disabled' : ''}>‹</button>`;
 
  for (let i = 1; i <= toplam; i++) {
    if (i === 1 || i === toplam || Math.abs(i - mevcutSayfa) <= 1) {
      html += `<button class="page-btn ${i === mevcutSayfa ? 'active' : ''}" onclick="sayfaDegistir(${i})">${i}</button>`;
    } else if (Math.abs(i - mevcutSayfa) === 2) {
      html += `<button class="page-btn" disabled>...</button>`;
    }
  }
 
  html += `<button class="page-btn" onclick="sayfaDegistir(${mevcutSayfa + 1})" ${mevcutSayfa === toplam ? 'disabled' : ''}>›</button>`;
  pagination.innerHTML = html;
}
 
function sayfaDegistir(sayfa) {
  const toplam = Math.ceil(filtreliAraclar.length / sayfaBasinaArac);
  if (sayfa < 1 || sayfa > toplam) return;
  mevcutSayfa = sayfa;
  araclariGoster();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
 