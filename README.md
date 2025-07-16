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

### Google OAuth Login
**POST** `/auth/google`

**Body:**
```json
{
  "token": "GOOGLE_ID_TOKEN"
}
```

**Response:**
```json
{
  "message": "Login Google berhasil",
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@gmail.com",
    "avatar": "https://lh3.googleusercontent.com/..."
  }
}
```

#### Cara Implementasi Google Login di Frontend:

```html
<!-- 1. Load Google Identity Services -->
<script src="https://accounts.google.com/gsi/client" async defer></script>

<!-- 2. Add Google Sign-In Button -->
<div id="g_id_onload"
     data-client_id="YOUR_GOOGLE_CLIENT_ID"
     data-callback="handleGoogleLogin">
</div>
<div class="g_id_signin" data-type="standard"></div>

<!-- 3. Handle Response -->
<script>
  function handleGoogleLogin(response) {
    // Send token to backend
    fetch('/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential })
    })
    .then(res => res.json())
    .then(data => {
      // Save token and redirect
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    });
  }
</script>
```

## � User Authentication Flow

### Regular Authentication
1. User register dengan email/password
2. Password di-hash dengan bcrypt
3. User login dengan email/password
4. Server validasi credentials dan return JWT token
5. Client simpan token di localStorage/cookies
6. Token digunakan untuk request ke protected endpoints

### Google OAuth Authentication
1. User klik "Login with Google" button
2. Google Identity Services popup muncul
3. User pilih Google account
4. Google return ID token ke frontend
5. Frontend kirim token ke endpoint `/auth/google`
6. Backend verify token dengan Google API
7. Jika valid, create/update user dan return JWT token
8. Flow selanjutnya sama dengan regular auth

## �📰 Berita & Kegiatan (Admin Only)

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
- **Google OAuth** - Social login dengan Google

## 📌 Catatan Tambahan

- Semua file media di-upload ke Cloudinary dengan kompresi otomatis
- JWT token berlaku selama 12 jam
- Admin account harus dibuat manual via database
- Semua endpoint public mendukung CORS
- File upload maksimal: Foto 5MB, Video 25MB
