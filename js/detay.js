async function getCarFromBackend() {

  const params = new URLSearchParams(window.location.search);

  const aracId = params.get("id");

  const response = await fetch(
    `http://localhost:8100/api/vehicles/${aracId}`
  );

  return await response.json();
}

/* ── İKON HARİTASI ── */
const IKON_MAP = {
  Klima: "fas fa-snowflake",
  Navigasyon: "fas fa-map-marker-alt",
  Bluetooth: "fab fa-bluetooth-b",
  "Geri Görüş Kamerası": "fas fa-video",
  "Hız Sabitleyici": "fas fa-tachometer-alt",
  "Park Sensörü": "fas fa-parking",
  "Start / Stop": "fas fa-power-off",
  "AUX / USB": "fas fa-plug",
  "Isıtmalı Koltuk": "fas fa-chair",
  Sunroof: "fas fa-sun",
  "LED Far": "fas fa-lightbulb",
};

document.addEventListener("DOMContentLoaded", async () => {

  const car = await getCarFromBackend();

  /* ── SAYFAYI DOLDUR ── */
  function doldurSayfa(car) {

    document.title = `${car.plateNo} - RentCar`;

    // Breadcrumb
    const bcArac = document.querySelector(".breadcrumb span");
    if (bcArac) bcArac.textContent = car.plateNo;

    // Başlık
    const aracAdi = document.querySelector(".arac-adi");
    if (aracAdi) aracAdi.textContent = car.plateNo;

    // Kategori
    const kategori = document.querySelector(".arac-kategori");
    if (kategori) kategori.textContent = car.status || "Araç";

    // Fiyat
    const fiyat = document.querySelector(".fiyat");
    if (fiyat)
      fiyat.textContent =
        "₺" + Number(car.dailyPrice).toLocaleString("tr-TR");

    // Meta bilgiler
    const metaSpans = document.querySelectorAll(".arac-meta span");

    if (metaSpans.length >= 4) {

      metaSpans[0].innerHTML =
        `<i class="far fa-calendar-alt"></i> ${car.year || "-"}`;

      metaSpans[1].innerHTML =
        `<i class="fas fa-gas-pump"></i> ${car.status || "-"}`;

      metaSpans[2].innerHTML =
        `<i class="fas fa-cog"></i> Otomatik`;

      metaSpans[3].innerHTML =
        `<i class="fas fa-user-friends"></i> 5 Kişilik`;
    }

    // Açıklama
    const aciklamaP = document.querySelector(".aciklama-card p");

    if (aciklamaP)
      aciklamaP.textContent =
        car.description || "Açıklama bulunamadı";

    // Ana görsel
    const mainImg = document.getElementById("mainImg");

    if (mainImg) {

      mainImg.src =
        `http://127.0.0.1:5500/${car.imageUrl}`;

      mainImg.alt = car.plateNo;
    }

    // Thumb görseller
    document.querySelectorAll(".thumb").forEach((t) => {

      t.src =
        `http://127.0.0.1:5500/${car.imageUrl}`;

      t.alt = car.plateNo;
    });

    // Özellik ikonları
    const features = [];

    if (car.hasAirConditioning)
      features.push("Klima");

    if (car.hasNavigation)
      features.push("Navigasyon");

    if (car.hasBluetooth)
      features.push("Bluetooth");

    if (car.hasRearViewCamera)
      features.push("Geri Görüş Kamerası");

    if (car.hasChildSeat)
      features.push("Çocuk Koltuğu");

     if (car.hasAppleCarplay)
      features.push("Apple CarPlay");

    // Sol ikon alanı
    const ozIkonlar =
      document.querySelector(".ozellik-ikonlar");

    if (ozIkonlar) {

      ozIkonlar.innerHTML = features.map((f) => `
        <div class="oz-ikon">
          <i class="${IKON_MAP[f] || "fas fa-check"}"></i>
          <span>${f}</span>
        </div>
      `).join("");
    }

    // Sağ özellik alanı
    const ozGrid = document.querySelector(".oz-grid");

    if (ozGrid) {

      ozGrid.innerHTML = features.map((f) => `
        <div class="oz-item">
          <i class="fas fa-check-circle"></i>
          ${f}
        </div>
      `).join("");
    }
  }

  doldurSayfa(car);

  /* ── GALERİ ── */
  const mainImg = document.getElementById("mainImg");
  const badge =
  document.querySelector(".musait-badge");

if (badge) {

  badge.textContent =
    car.status || "Müsait";

}

  const thumbs = document.querySelectorAll(".thumb");

  const prevBtn = document.getElementById("prevBtn");

  const nextBtn = document.getElementById("nextBtn");

  const images = Array.from(thumbs).map((t) => t.src);

  let current = 0;

  function goTo(idx) {

    current = (idx + images.length) % images.length;

    mainImg.style.opacity = "0";

    setTimeout(() => {

      mainImg.src = images[current];

      mainImg.style.opacity = "1";

    }, 180);

    thumbs.forEach((t, i) =>
      t.classList.toggle("active", i === current)
    );
  }

  if (prevBtn)
    prevBtn.addEventListener("click",
      () => goTo(current - 1));

  if (nextBtn)
    nextBtn.addEventListener("click",
      () => goTo(current + 1));

  thumbs.forEach((t, i) =>
    t.addEventListener("click",
      () => goTo(i)));

});