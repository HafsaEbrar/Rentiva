# 🚗 Rent A Car Project

Bu proje, kullanıcıların araç kiralayabildiği ve yöneticilerin araçları yönetebildiği bir **araç kiralama sistemidir**.

## 👥 Proje Yapısı

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Java + Spring Boot
* **Veritabanı:** (Backend tarafında belirlenecek)

---

## 🌐 Özellikler

### 👤 Müşteri Tarafı

* Araçları listeleme
* Araç detaylarını görüntüleme
* Filtreleme (yakıt, vites, arama)
* Rezervasyon oluşturma
* Ek hizmet seçimi (çocuk koltuğu, sigorta, vb.)

### 🧑‍💼 Yönetici (Admin)

* Araç ekleme
* Araç güncelleme
* Araç silme
* Araç durumunu değiştirme (müsait, kirada, bakımda)

---

## 🔗 API Endpointleri

### 🚘 Araçlar

#### Tüm araçları getir

GET /api/cars

#### Tek araç getir

GET /api/cars/{id}

#### Araç ekle

POST /api/cars

#### Araç güncelle

PUT /api/cars/{id}

#### Araç sil

DELETE /api/cars/{id}

---

### 📅 Rezervasyonlar

#### Rezervasyon oluştur

POST /api/reservations

#### Rezervasyonları getir

GET /api/reservations

---

## 🧾 Örnek Veri Formatı

```json
{
  "id": 1,
  "brand": "BMW",
  "model": "320i",
  "year": 2020,
  "fuel": "Benzin",
  "transmission": "Otomatik",
  "price": 750,
  "status": "available",
  "image": "https://...",
  "features": ["Klima", "Bluetooth"]
}
```

---

## ⚙️ Kurulum

### Frontend

```bash
cd frontend
# index.html dosyasını tarayıcıda aç
```

---

### Backend (Spring Boot)

```bash
# Backend projesini çalıştır
mvn spring-boot:run
```

Backend varsayılan olarak şu adreste çalışır:

```
http://localhost:8080
```

---

## 🔒 CORS Ayarı (Backend)

Frontend ile iletişim için backend tarafında CORS açılmalıdır:

```java
@CrossOrigin(origins = "*")
```

---

## 🚀 Geliştirme Süreci

* Frontend ve backend ayrı branchlerde geliştirilmektedir.
* Pull Request ile birleştirilecektir.

---

## 📌 Notlar

* Frontend, backend API'ye göre geliştirilmiştir.
* JSON veri formatı değiştirilmemelidir.

---

## 👨‍💻 Geliştiriciler

* Frontend: [Ali Çağrı]
* Backend: [Takım Arkadaşı]

---
