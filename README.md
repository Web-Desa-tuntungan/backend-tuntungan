# 📡 Desa Tuntungan 1 Backend API

Backend API untuk platform layanan digital Desa Tuntungan 1, dibuat menggunakan Hapi.js dan MySQL dengan fitur lengkap untuk pengelolaan desa modern.

## 🛠️ Fitur Utama

- **🔐 Autentikasi:** Register & Login dengan JWT
- **📰 Berita & Kegiatan:** CRUD oleh Admin dengan upload gambar
- **🖼️ Galeri:** Upload foto & video ke Cloudinary
- **👥 Perangkat Desa:** Manajemen data perangkat desa dengan foto
- **🧾 Layanan Digital:** Pengajuan & Approval layanan masyarakat
- **🔒 Role-based Access:** Admin dan User dengan permission berbeda

## 📁 Folder Structure

```
src/
├── config/         # Database configuration
├── handlers/       # Business logic untuk setiap fitur
├── routes/         # API routes modular
├── middlewares/    # Authentication middleware
├── utils/          # JWT helpers & utilities
└── server.js       # Entry point aplikasi
```

## 📌 Base URL

```
http://localhost:8080
```

> Untuk production, ganti dengan URL deployment Anda

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
  "message": "Login berhasil",
  "token": "JWT_TOKEN_HERE"
}
```

## 📰 Berita & Kegiatan (Admin Only)

### Tambah Berita
**POST** `/tambah/berita`

**Headers:** `Authorization: Bearer JWT_TOKEN`

**Form Data:**
- `judul`: Judul berita
- `konten`: Isi berita lengkap
- `kategori`: artikel | agenda | pengumuman
- `image`: File gambar (optional)

### Lihat Semua Berita (Public)
**GET** `/public/berita`

### Lihat Berita by ID (Public)
**GET** `/public/berita/{id}`

### Update Berita (Admin)
**PUT** `/edit/berita/{id}`

### Hapus Berita (Admin)
**DELETE** `/hapus/berita/{id}`

## 🖼️ Galeri

### Upload Foto/Video (Admin Only)
**POST** `/tambah/galeri`

**Headers:** `Authorization: Bearer JWT_TOKEN`

**Form Data:**
- `tipe`: foto | video
- `deskripsi`: Deskripsi media
- `file`: File foto/video (max 25MB)

### Lihat Semua Galeri (Public)
**GET** `/lihat/galeri`

### Hapus Galeri (Admin Only)
**DELETE** `/lihat/galeri/{id}`

## 👥 Perangkat Desa

### Lihat Semua Perangkat Desa (Public)
**GET** `/lihat/perangkat-desa`

### Lihat Perangkat Desa by ID (Public)
**GET** `/lihat/perangkat-desa/{id}`

### Tambah Perangkat Desa (Admin Only)
**POST** `/tambah/perangkat-desa`

**Headers:** `Authorization: Bearer JWT_TOKEN`

**Form Data:**
- `nama`: Nama lengkap
- `jabatan`: Jabatan/posisi
- `bio`: Biografi (optional)
- `urutan`: Urutan tampil (optional)
- `foto`: File foto (optional, max 5MB)

### Update Perangkat Desa (Admin Only)
**PUT** `/edit/perangkat-desa/{id}`

### Hapus Perangkat Desa (Admin Only)
**DELETE** `/hapus/perangkat-desa/{id}`

## 🧾 Layanan Digital

### Ajukan Layanan (User Only)
**POST** `/tambah/layanan`

**Headers:** `Authorization: Bearer JWT_TOKEN`

**Body:**
```json
{
  "jenis": "surat",
  "isi": "Keperluan kerja"
}
```

### Lihat Layanan User (User Only)
**GET** `/layanan/user`

### Lihat Semua Pengajuan (Admin Only)
**GET** `/lihat/layanan`

### Update Status Layanan (Admin Only)
**PATCH** `/layanan/{id}/status`

## 🔒 Authorization Roles

| Role  | Akses                                    |
|-------|------------------------------------------|
| user  | Login, Ajukan Layanan, Lihat Status     |
| admin | CRUD Berita, Galeri, Perangkat, Layanan |

## 📥 Header Authorization

Untuk endpoint yang memerlukan autentikasi:
```http
Authorization: Bearer JWT_TOKEN_HERE
```

## 🚀 Teknologi

- **Node.js** + **Hapi.js** - Backend framework
- **MySQL** - Database dengan connection pooling
- **JWT** - Authentication & authorization
- **Cloudinary** - Cloud storage untuk media
- **Sharp** - Image compression
- **bcrypt** - Password hashing

## 📌 Catatan Tambahan

- Semua file media di-upload ke Cloudinary dengan kompresi otomatis
- JWT token berlaku selama 12 jam
- Admin account harus dibuat manual via database
- Semua endpoint public mendukung CORS
- File upload maksimal: Foto 5MB, Video 25MB
