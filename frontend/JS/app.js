const cars = [
  {
    id: 1,
    brand: "BMW 320i",
    year: 2020,
    fuel: "Benzin",
    gear: "Otomatik",
    price: 750,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54c?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 2,
    brand: "Audi A4",
    year: 2019,
    fuel: "Dizel",
    gear: "Otomatik",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=60",
  },
];

const container = document.querySelector(".vehicle-list");

cars.forEach((car) => {
  container.innerHTML += `
    <div class="card">
      <img src="${car.image}" />
      <div class="card-body">
        <h3>${car.brand}</h3>
        <p>${car.year} • ${car.fuel} • ${car.gear}</p>
        <div class="price">₺${car.price} / gün</div>
        <button class="detail-btn">Detayları Gör</button>
      </div>
    </div>
  `;
});
