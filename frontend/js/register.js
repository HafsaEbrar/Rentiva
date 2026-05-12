let selectedType = 'kullanici';

function selectType(type) {
  selectedType = type;
  document.querySelectorAll('.selection-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.btn-select').forEach(b => b.classList.remove('active'));
  if (type === 'kullanici') {
    document.querySelectorAll('.selection-card')[0].classList.add('active');
    document.getElementById('btnKullanici').classList.add('active');
  } else {
    document.querySelectorAll('.selection-card')[1].classList.add('active');
    document.getElementById('btnYonetici').classList.add('active');
  }
}

document.querySelectorAll('.selection-card').forEach((card, i) => {
  card.addEventListener('dblclick', () => {
    showForm(i === 0 ? 'kullanici' : 'yonetici');
  });
});

document.getElementById('btnKullanici').addEventListener('click', (e) => {
  e.stopPropagation();
  showForm('kullanici');
});

document.getElementById('btnYonetici').addEventListener('click', (e) => {
  e.stopPropagation();
  showForm('yonetici');
});

function showForm(type) {
  history.pushState({screen: 'form'}, '', 'register.html');
  document.getElementById('selectionScreen').style.display = 'none';
  document.getElementById('kullaniciForm').style.display = 'none';
  document.getElementById('yoneticiForm').style.display = 'none';
  if (type === 'kullanici') {
    document.getElementById('kullaniciForm').style.display = 'block';
  } else {
    document.getElementById('yoneticiForm').style.display = 'block';
  }
}

function goBack() {
  history.pushState(null, '', 'register.html');
  document.getElementById('kullaniciForm').style.display = 'none';
  document.getElementById('yoneticiForm').style.display = 'none';
  document.getElementById('selectionScreen').style.display = 'flex';
}

window.addEventListener('popstate', () => {
  document.getElementById('kullaniciForm').style.display = 'none';
  document.getElementById('yoneticiForm').style.display = 'none';
  document.getElementById('selectionScreen').style.display = 'flex';
});

function togglePass(id) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
}

function showFileName(input) {
  const label = document.getElementById('k_file_label');
  if (input.files.length > 0) {
    label.innerHTML = `<span class="file-icon">✅</span><span>${input.files[0].name}</span>`;
  }
}

// ===== KULLANICI KAYIT =====
async function registerKullanici() {
  const adsoyad = document.getElementById('k_adsoyad').value.trim();
  const email = document.getElementById('k_email').value.trim();
  const telefon = document.getElementById('k_telefon').value.trim();
  const sifre = document.getElementById('k_sifre').value.trim();
  const sifre2 = document.getElementById('k_sifre2').value.trim();
  const tc = document.getElementById('k_tc').value.trim();
  const ehliyet = document.getElementById('k_ehliyet').value.trim();
  const ehliyetFile = document.getElementById('k_ehliyet_file').files[0];
  const birthDate = document.getElementById('k_birthdate').value; // ← EKLE

  if (!adsoyad || !email || !telefon || !sifre || !tc || !ehliyet || !birthDate) {
    alert('Lütfen tüm alanları doldurun.');
    return;
  }

  if (sifre !== sifre2) {
    alert('Şifreler eşleşmiyor.');
    return;
  }

  let ehliyetBase64 = null;
  if (ehliyetFile) {
    ehliyetBase64 = await toBase64(ehliyetFile);
  }

  const body = {
    fullName: adsoyad,
    email,
    phone: telefon,
    password: sifre,
    nationalId: tc,
    driverLicenseNumber: ehliyet,
    licenseImage: ehliyetBase64,
    birthDate: birthDate // ← EKLE
  };

  try {
    const response = await fetch('http://localhost:8100/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
      alert('Kayıt başarılı! Giriş yapabilirsiniz.');
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Kayıt başarısız.');
    }
  } catch (error) {
    alert('Sunucuya bağlanılamadı.');
    console.error(error);
  }
}

// ===== YÖNETİCİ KAYIT =====
async function registerYonetici() {
  const adsoyad = document.getElementById('y_adsoyad').value.trim();
  const email = document.getElementById('y_email').value.trim();
  const telefon = document.getElementById('y_telefon').value.trim();
  const sifre = document.getElementById('y_sifre').value.trim();
  const sifre2 = document.getElementById('y_sifre2').value.trim();
  const tc = document.getElementById('y_tc').value.trim();
  const sirket = document.getElementById('y_sirket').value.trim();
  const vergino = document.getElementById('y_vergino').value.trim();
  const city = document.getElementById('y_city').value.trim();
  const district = document.getElementById('y_district').value.trim();
  const mahalle = document.getElementById('y_mahalle').value.trim();
  const sokak = document.getElementById('y_sokak').value.trim();
  const binaNo = document.getElementById('y_bina_no').value.trim();
  const gorev = document.getElementById('y_gorev').value;

  if (!adsoyad || !email || !telefon || !sifre || !tc || !sirket || !vergino || !gorev) {
    alert('Lütfen tüm alanları doldurun.');
    return;
  }

  if (sifre !== sifre2) {
    alert('Şifreler eşleşmiyor.');
    return;
  }

  const body = {
    fullName: adsoyad,
    email,
    phone: telefon,
    password: sifre,
    nationalId: tc,
    companyName: sirket,
    taxNumber: vergino,
    sirketTel: document.getElementById('y_sirket_tel').value.trim(),
    city: city,
    district: district,
    mahalle: mahalle,
    sokak: sokak,
    binaNo: binaNo
  };

  try {
    const response = await fetch('http://localhost:8100/api/users/register-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
      alert('Yönetici kaydı başarılı! Giriş yapabilirsiniz.');
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Kayıt başarısız.');
    }
  } catch (error) {
    alert('Sunucuya bağlanılamadı.');
    console.error(error);
  }
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}