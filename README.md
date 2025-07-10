# 📡 Desa API - Hapi.js + MySQL

Backend API untuk platform layanan digital desa, dibuat menggunakan Hapi.js dan MySQL.

## 🛠️ Fitur Utama

- Autentikasi: Register & Login
- Berita & Kegiatan: CRUD oleh Admin
- Galeri: Upload foto & video
- Layanan Digital: Pengajuan & Approval
- Role-based access: Admin dan User

---

## 📌 Base URL

```
https://your-api-domain.com/
```

> Ganti `your-api-domain.com` dengan URL deployment kamu (misalnya Railway, Vercel, dll.)

---

## 🔐 Authentication

### Register
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

---

### Login  
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "token": "JWT_TOKEN_HERE"
}
```

---

## 📰 Berita & Kegiatan (Admin Only)

Semua endpoint di bawah ini **wajib menyertakan JWT Bearer Token** dan memiliki role `admin`.

### Tambah Berita
**POST** `/berita`

**Body:**
```json
{
  "judul": "Judul Berita",
  "konten": "Isi berita lengkap...",
  "kategori": "artikel" // atau "agenda", "pengumuman"
}
```

---

### Lihat Semua Berita
**GET** `/berita`

---

### Lihat Berita Berdasarkan ID
**GET** `/berita/{id}`

---

### Lihat Berita Berdasarkan Kategori
**GET** `/berita/kategori/{kategori}`

---

### Update Berita
**PUT** `/berita/{id}`

**Body:**
```json
{
  "judul": "Judul Baru",
  "konten": "Konten Baru",
  "kategori": "agenda"
}
```

---

### Hapus Berita
**DELETE** `/berita/{id}`

---

## 🖼️ Galeri

### Upload Foto/Video (Admin Only)
**POST** `/galeri`

**Form Data:**
- `tipe`: foto | video
- `deskripsi`: deskripsi singkat
- `file`: (upload file .jpg, .png, .mp4, dll)

> Max size: 10MB

---

### Lihat Semua Galeri (Publik)
**GET** `/galeri`

---

### Hapus Galeri (Admin Only)
**DELETE** `/galeri/{id}`

---

## 🧾 Layanan Digital

### Ajukan Layanan (User Only)
**POST** `/layanan`

**Body:**
```json
{
  "jenis": "Surat Pengantar",
  "keterangan": "Keperluan kerja"
}
```

---

### Lihat Layanan User (User Only)
**GET** `/layanan/user`

---

### Lihat Semua Pengajuan (Admin Only)
**GET** `/layanan`

---

### Update Status Layanan (Admin Only)
**PATCH** `/layanan/{id}/status`

**Body:**
```json
{
  "status": "disetujui"
}
```

---

## 🧾 Authorization Roles

| Role  | Akses                                 |
|-------|----------------------------------------|
| user  | Login, Ajukan Layanan, Lihat Status    |
| admin | CRUD Berita, Galeri, Validasi Layanan  |

---

## 📥 Header Authorization

Untuk endpoint yang butuh autentikasi:
```http
Authorization: Bearer JWT_TOKEN_HERE
```

---

## 🚀 Teknologi

- **Node.js** + **Hapi.js**
- **MySQL** (via `mysql2` / `pool`)
- **JWT** untuk autentikasi
- **Multer / stream** untuk upload file galeri

---

## 📌 Catatan Tambahan

- Pastikan menggunakan **JWT Token valid** pada request protected.
- Upload galeri hanya boleh dilakukan oleh `admin`.
- Tidak ada fitur registrasi admin (dimasukkan manual via DB).

---
