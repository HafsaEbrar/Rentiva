// ===== SECTION YÖNETİMİ =====
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const section = document.getElementById('section-' + name);
  if (section) section.style.display = 'block';

  const titles = {
    'dashboard': ['Hoş geldiniz, Yönetici 👋', 'Araçlarınızı yönetin, rezervasyonları takip edin.'],
    'arac-ekle': ['Araç Ekle', 'Yeni araç bilgilerini girerek sisteme kaydedin.'],
    'araclar':   ['Araç Listesi', 'Şirketinize ait tüm araçlar.'],
  };

  if (titles[name]) {
    document.getElementById('pageTitle').textContent = titles[name][0];
    document.getElementById('pageSubtitle').textContent = titles[name][1];
  }

  if (name === 'araclar') araclariYukle();
}

// ===== FORM SEKME YÖNETİMİ =====
function switchFormTab(btn, tab) {
  document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.form-tab-content').forEach(c => c.style.display = 'none');
  btn.classList.add('active');
  document.getElementById('tab-' + tab).style.display = 'block';
}

// ===== FORM TEMİZLE =====
function temizleForm() {
  ['plaka','model_adi','yil','gunluk_ucret','aciklama','airbag_sayisi','gorsel_url'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['marka','kategori','yakit_turu','vites_turu'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });
  document.getElementById('durum').value = 'uygun';
  ['klima','cocuk_koltugu','apple_carplay','geri_kamera','bluetooth','navigasyon'].forEach(id => {
    document.getElementById(id).checked = false;
  });
}

// ===== ARAÇ EKLE =====
async function aracEkle() {
  const plaka        = document.getElementById('plaka').value.trim();
  const yil          = document.getElementById('yil').value;
  const gunluk_ucret = document.getElementById('gunluk_ucret').value;
  const durum        = document.getElementById('durum').value;
  const aciklama     = document.getElementById('aciklama').value.trim();
  const airbag       = document.getElementById('airbag_sayisi').value;
  const gorsel_url   = document.getElementById('gorsel_url').value.trim();

  if (!plaka || !yil || !gunluk_ucret) {
    alert('Lütfen zorunlu alanları (*) doldurun.');
    return;
  }

  const body = {
    plateNo: plaka,
    year: parseInt(yil),
    dailyPrice: parseFloat(gunluk_ucret),
    status: durum,
    description: aciklama,
    imageUrl: gorsel_url,
    airbagCount: airbag ? parseInt(airbag) : null,
    hasAirConditioning: document.getElementById('klima').checked,
    hasChildSeat: document.getElementById('cocuk_koltugu').checked,
    hasAppleCarplay: document.getElementById('apple_carplay').checked,
    hasRearViewCamera: document.getElementById('geri_kamera').checked,
    hasBluetooth: document.getElementById('bluetooth').checked,
    hasNavigation: document.getElementById('navigasyon').checked,
  };

  const token = localStorage.getItem('token');

  try {
    const response = await fetch('http://localhost:8080/api/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
      alert('Araç başarıyla eklendi!');
      temizleForm();
      showSection('araclar');
    } else {
      alert(data.message || 'Araç eklenemedi.');
    }
  } catch (error) {
    alert('Sunucuya bağlanılamadı.');
    console.error(error);
  }
}

// ===== ARAÇLARI YÜKLE =====
async function araclariYukle() {
  const token = localStorage.getItem('token');
  const tbody = document.getElementById('aracTableBody');

  tbody.innerHTML = '<tr><td colspan="9" class="empty-row">Yükleniyor...</td></tr>';

  try {
    const response = await fetch('http://localhost:8080/api/vehicles', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();

    if (response.ok && data.length > 0) {
      document.getElementById('statToplam').textContent = data.length;

      tbody.innerHTML = data.map(arac => `
        <tr>
          <td><strong>${arac.plateNo}</strong></td>
          <td>${arac.year || '-'}</td>
          <td>${arac.status || '-'}</td>
          <td>${arac.dailyPrice ? '₺' + Number(arac.dailyPrice).toLocaleString('tr-TR') : '-'}</td>
          <td>${arac.hasAirConditioning ? '✅' : '❌'}</td>
          <td>${arac.hasBluetooth ? '✅' : '❌'}</td>
          <td>${arac.hasNavigation ? '✅' : '❌'}</td>
          <td>${arac.airbagCount || '-'}</td>
          <td>
            <div class="action-btns">
              <button class="action-btn" title="Sil" onclick="aracSil(${arac.id})">🗑️</button>
            </div>
          </td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="9" class="empty-row">Henüz araç eklenmedi.</td></tr>';
    }
  } catch (error) {
    tbody.innerHTML = '<tr><td colspan="9" class="empty-row">Veriler yüklenemedi.</td></tr>';
    console.error(error);
  }
}

// ===== ARAÇ SİL =====
async function aracSil(id) {
  if (!confirm('Bu aracı silmek istediğinize emin misiniz?')) return;

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`http://localhost:8080/api/vehicles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      alert('Araç silindi.');
      araclariYukle();
    } else {
      alert('Silme işlemi başarısız.');
    }
  } catch (error) {
    alert('Sunucuya bağlanılamadı.');
    console.error(error);
  }
}

// ===== FİLTRELE =====
function araclariFiltrele(query) {
  const rows = document.querySelectorAll('#aracTableBody tr');
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(query.toLowerCase()) ? '' : 'none';
  });
}

// ===== YARDIMCI =====
function durumText(durum) {
  const map = { uygun: 'Uygun', rezerve: 'Rezerve', bakimda: 'Bakımda' };
  return map[durum] || durum;
}